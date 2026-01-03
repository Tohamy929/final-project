
import { ProductInterface } from '@/interfaces/products.interface'
import Link from 'next/link'
import React from 'react'
import ProductButton from './ProductButton'
import WishlistButton from './WishlistButton'
import Image from 'next/image'

export default function ProductItem({ product }: { product: ProductInterface }) {
  return (
    <div className='lg:w-1/6 md:w-1/3 sm:w-full my-5 p-4'>
      <Link href={`/productdetails/${product._id}`}>
        <div className='product-item'>
          <Image width={200} height={200} src={product.imageCover} className='w-full h-[300px] object-cover' alt="" />
          <p className='my-2 font-bold line-clamp-1 text-main'>{product.title}</p>
          <p className='line-clamp-1'>{product.description}</p>
          <div className='flex justify-between items-center'>
            <div className='my-4'>
              <p className={product.priceAfterDiscount ? 'line-through' : ''}>{product.price} EGP</p>
              {product.priceAfterDiscount ? <p className='text-main'>{product.priceAfterDiscount} EGP</p> : ''}
            </div>
            <p>{product.ratingsAverage} <i className='fa-solid fa-star text-yellow-400'></i></p>
          </div>
        </div>
      </Link>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <ProductButton product={product} />
        </div>
        <div className='flex-1'>
          <WishlistButton product={product} />
        </div>
      </div>
    </div>
  )
}
