import { ProductInterface } from "@/interfaces/products.interface"

export async function handleProducts(): Promise<ProductInterface[]> {
  try {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/products', {
      next: { revalidate: 60 }, 
    })
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (error) {
    console.error("handleProducts error:", error)
    return []
  }
}
