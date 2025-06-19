import Container from "@/components/ui/container";
import Link from "next/link";
import { MainNav } from "@/components";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import Image from "next/image";

export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <nav className="bg-white shadow-md border-b border-[#994C00] shadow-[#994C00] w-full px-8 md:px-4">
            <Container>
                <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                    {/* Branding */}
                    <Link href="/" className="text-[#994C00] md:order-1 flex items-center space-x-1 -ml-6">
                        {/* Logo */}
                        <Image
                        src="/Logo2.png" // Path to your logo
                        alt="Cabimah Adventures Logo"
                        width={120} // Base width
                        height={120} // Base height
                        className="w-16 h-16 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-18 lg:h-18" // Responsive sizes
                    />

                        <p className="text-lg md:text-xl -ml-12 -mr-12 font-bold">Bites By Brayo</p>
                    </Link>

                    {/* Navigation Links */}
                    <div className="order-3 w-full md:w-auto md:order-2">
                        <MainNav data={categories || []} />
                    </div>

                    {/* Actions */}
                    <div className="order-2  md:order-3">
                        <NavbarActions />
                    </div>
                </div>
            </Container>
        </nav>
    );
};

export default Navbar;