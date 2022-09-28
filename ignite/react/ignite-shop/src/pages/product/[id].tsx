import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Stripe from 'stripe'
import { api } from '../../lib/axios'
import { stripe } from '../../lib/stripe'
import { ImageContainer, ProductContainer, ProductDetails } from '../../styles/pages/product'

interface ProductProps {
    product: {
      id: string
      name: string
      imageUrl: string
      price: string
      description: string
      defaultPriceId: string
    }
}

export default function Product({ product }: ProductProps) {
    async function handleBuyProduct() {
        try {
            const response = await api.post('/api/checkout', {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        } catch(err) {
            console.error(err)
            alert('Erro ao conectar')
        }
    }

    return (
        <>
            <Head><title>{product.name} | Ignite shop</title></Head>

            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} width={520} height={480} alt="" />
                </ImageContainer>
                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>

                    <p>{product.description}</p>
                
                    <button onClick={handleBuyProduct}>Comprar agora</button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: '' } }
        ],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps<ProductProps, { id: string }> = async ({ params }) => {
    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price']
    })
  
  
    return {
      props: {
        product: {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format((product.default_price as Stripe.Price).unit_amount / 100),
            description: product.description,
            defaultPriceId: (product.default_price as Stripe.Price).id
          }
      },
      revalidate: 60 * 60 * 1 // 1 hora
    }
  }