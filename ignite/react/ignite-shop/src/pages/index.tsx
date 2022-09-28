import Image from "next/image"
import { HomeContainer, Product } from "../styles/pages/home"
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"
import Link from "next/link"
import Stripe from "stripe"
import Head from 'next/head'

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  })
  
  return (
    <>
      <Head><title>Home | Ignite shop</title></Head>
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => (
          <Link key={product.id} href={`product/${product.id}`} prefetch={false}>
            <Product   className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt={product.description} />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })


  const products = response.data.map(product => ({
    id: product.id,
    name: product.name,
    imageUrl: product.images[0],
    price: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format((product.default_price as Stripe.Price).unit_amount / 100),
    description: product.description
  }))

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 horas
  }
}
