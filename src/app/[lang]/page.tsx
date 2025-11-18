import { getDictionary } from './dictionaries'
 
export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'fr' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang) 
  return <button>{dict.products.cart}</button> 
}