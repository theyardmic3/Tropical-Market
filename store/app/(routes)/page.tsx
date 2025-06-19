import Container from "@/components/ui/container";
import Billboard from "@/components/billboard";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";

export const revalidate = 0;

const HomePage = async () => {
    const billboard = await getBillboard('f385a304-4c58-4ee4-a0ed-36386af06cbf');
    const products = await getProducts({ isFeatured: true })
    return (
        <Container>
            <div className="pb-10 space-y-10 ">
                <Billboard data={billboard} />
                <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <ProductList title="Explore Our Popular Products" items={products} />
                </div>
            </div>
        </Container>
    )
}

export default HomePage;
