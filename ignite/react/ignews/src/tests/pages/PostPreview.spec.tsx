import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = { slug: 'my-new-post', title: 'My New Post', content: '<p>Post excerpt</p>', updatedAt: '10 de Abril' }


jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

describe('PostPreview Page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<PostPreview post={post}/>)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' } as any
            , 
            false
        ]);

        const pushMock = jest.fn();

        const useRouterMocked = mocked(useRouter);
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        render(<PostPreview post={post}/>)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My New Post'}
                    ],
                    content: [
                        { type: 'paragraph', text: 'post excerpt'}
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        
        const response = await getStaticProps({ params: { slug: 'my-new-post'}});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>post excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        ) 

    })
}) 
