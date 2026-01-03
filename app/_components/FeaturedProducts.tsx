import { handleProducts } from '@/apis/products.api'
import { ProductInterface } from '@/interfaces/products.interface'
import ProductItem from './ProductItem'

export default async function FeaturedProducts() {
  const products = await handleProducts()

  return (
    <>
      {products.map((product) => (
        <ProductItem product={product} key={product._id} />
      ))}
    </>
  )
}
