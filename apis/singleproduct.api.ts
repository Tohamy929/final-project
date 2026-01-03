export async function handleSingleProduct(prodid:string)
{
  try {
      const data = await fetch (`https://ecommerce.routemisr.com/api/v1/products/${prodid}`
        ,{cache:'no-store'}
    )
    const res = await data.json()
    return res?.data
  } catch (error) {
   return error ;
    
  }
}