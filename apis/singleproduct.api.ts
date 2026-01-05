export async function handleSingleProduct(prodid: string) {
  try {
    const data = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${prodid}`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    const res = await data.json();
    return res?.data;
  } catch (error) {
    console.error("handleSingleProduct error:", error);
    return null;
  }
}