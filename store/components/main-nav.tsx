"use client"
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface MainNavProps {
    data: Category[] | []
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
    const pathname = usePathname();

    const routes = data.map(route => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`
    }))

    return (
        <nav className='flex items-center mx-auto text-center justify-center -mt-2 -mb-2 space-x-4 lg:space-x-6 '>
            {routes.map(route => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-[0.875rem] sm:text-sm-custom md:text-md-custom lg:text-lg-custom xl:text-xl-custom font-bold transition-colors hover:text-[#994C00] relative before:content-[""] before:absolute before:left-0 before:bottom-0 before:w-0 before:h-[2px] before:bg-[#994C00] hover:before:w-full hover:transition-all hover:duration-5000 hover:ease-in-out',
                        route.active ? 'text-[#994C00]' : 'text-[#556B2F]'
                    )}
                    
                    
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav;