import { handleSingleProduct } from '@/apis/singleproduct.api'
import ProductButton from '@/app/_components/ProductButton'
import ProductDetailsCom from '@/app/_components/ProductDetailsCom'
import { ProductInterface } from '@/interfaces/products.interface'
import Loading from '@/Loading'
import Image from 'next/image'
import React, { Suspense } from 'react'

interface pageProp{
    params:{id:string}
}

export default async function page({params}:pageProp) {
const {id}= await params
const data : ProductInterface = await handleSingleProduct(id)

  return (
    <Suspense fallback={<Loading></Loading>}>
    <ProductDetailsCom product={data}></ProductDetailsCom>
    </Suspense>
  )
}
