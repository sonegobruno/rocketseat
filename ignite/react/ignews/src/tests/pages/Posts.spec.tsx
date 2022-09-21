import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
    { slug: 'my-new-posts', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de Abril' }
]

jest.mock('../../services/prismic');

describe('Posts Page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts}/>)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
    })

    it('loadds initial data', async () => {
        const getPrimiscClientMocked = mocked(getPrismicClient);

        getPrimiscClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My New Post'}
                            ],
                            content: [
                                { type: 'paragraph', text: 'post excerpt'}
                            ]
                        },
                        last_publication_date: '04-01-2021'
                    },
                ]
            })
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My New Post',
                        excerpt: 'post excerpt',
                        updatedAt: '01 de abril de 2021',
                    }]
                }
            })
        )  
    })
}) 
