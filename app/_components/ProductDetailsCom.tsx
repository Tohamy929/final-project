import React from 'react'
import ProductButton from './ProductButton'
import Image from 'next/image'
import { ProductInterface } from '@/interfaces/products.interface'
import WishlistButton from './WishlistButton'

export default function ProductDetailsCom({product}:{product:ProductInterface}) {
  return (
    <div className='flex md:flex-nowrap sm:flex-wrap items-center md:gap-10'>
        <div className='md:w-1/3 w-full'>
        <Image width={300} height={300} src={product.imageCover} className='w-full' alt="product" />
        <ul className='flex gap-5 justify-center my-10'>
            {product.images.map(img=><li key={img}><Image width={80} height={80} src={img} alt="pic" /></li>)}
        </ul>
        </div>
        <div className='md:w-2/3 w-full'>
         <p className='my-2 font-bold line-clamp-1 text-main'>{product.title}</p>
            <p className='line-clamp-1'>{product.description}</p>
            <div className='flex justify-between items-center'>
                <div className='my-4'>
                     <p className={product.priceAfterDiscount?'line-through':''}>{product.price} EGP</p>
            {product.priceAfterDiscount ? <p className='text-main'>{product.priceAfterDiscount} EGP</p>:''}
                </div>
           
            <p>{product.ratingsAverage} <i className='fa-solid fa-star text-yellow-400'></i></p>

            </div>
        <div className='flex gap-2'>
               <div className='flex-1'>
                 <ProductButton product={product} />
               </div>
               <div className='flex-1'>
                 <WishlistButton product={product} />
               </div>
             </div>
        </div>
         
    </div>
  )
}
