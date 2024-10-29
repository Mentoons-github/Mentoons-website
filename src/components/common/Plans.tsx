
interface SVGType {
    viewBox: string;
    path: string;
}

interface Plan {
    title: string;
    price: string;
    svg: SVGType;
    features: string[];
}

const Plans = () => {
    const plans:Plan[] = [
        {
            title: 'Free Plan',
            price: '$0',
            svg: {
                viewBox: '0 0 31 30',
                path: 'M8.42418 27.2608V12.0502C8.42418 11.8031 8.22388 11.6028 7.97681 11.6028V11.6028C5.55154 11.6028 4.3389 11.6028 3.58547 12.3562C2.83203 13.1097 2.83203 14.3223 2.83203 16.7476V22.116C2.83203 24.5413 2.83203 25.754 3.58547 26.5074C4.3389 27.2608 5.55154 27.2608 7.97681 27.2608H8.42418ZM8.42418 27.2608L8.42418 22.5246C8.42418 15.9141 9.90241 9.38734 12.7507 3.42199V3.42199C13.2066 2.46714 14.4408 2.19891 15.2519 2.87841C16.4455 3.87836 17.135 5.35554 17.135 6.91266V8.08463C17.135 9.40562 18.2059 10.4765 19.5269 10.4765H24.0982C25.1518 10.4765 25.6786 10.4765 26.0736 10.6078C27.0571 10.9346 27.7484 11.8197 27.8273 12.8531C27.859 13.2681 27.7314 13.7792 27.4762 14.8014L25.3389 23.3623C24.8715 25.2346 24.6377 26.1707 23.9399 26.7158C23.242 27.2609 22.2771 27.2609 20.3473 27.2609L8.42418 27.2608Z'
            },
            features: [
                'AI advisor for a day',
                '2 auto tracking',
                '7 Day transaction clearing',
                '24/7 Customer support'
            ]
        },
        {
            title: 'Business Plan',
            price: '$150',
            svg: {
                viewBox: '0 0 30 30',
                path: 'M26.8333 21.25C26.8333 20.6977 26.3856 20.25 25.8333 20.25C25.281 20.25 24.8333 20.6977 24.8333 21.25H26.8333ZM5.16667 21.25C5.16667 20.6977 4.71895 20.25 4.16667 20.25C3.61438 20.25 3.16667 20.6977 3.16667 21.25H5.16667ZM4.16667 8.85714H25.8333V6.85714H4.16667V8.85714ZM26.5 9.64286V16.7857H28.5V9.64286H26.5ZM3.5 16.7857V9.64286H1.5V16.7857H3.5ZM12.5 17.5714H4.16667V19.5714H12.5V17.5714ZM25.8333 17.5714H17.5V19.5714H25.8333V17.5714ZM1.5 16.7857C1.5 18.2581 2.63005 19.5714 4.16667 19.5714V17.5714C3.86234 17.5714 3.5 17.2858 3.5 16.7857H1.5ZM26.5 16.7857C26.5 17.2858 26.1377 17.5714 25.8333 17.5714V19.5714C27.37 19.5714 28.5 18.2581 28.5 16.7857H26.5ZM25.8333 8.85714C26.1377 8.85714 26.5 9.14282 26.5 9.64286H28.5C28.5 8.17045 27.37 6.85714 25.8333 6.85714V8.85714ZM4.16667 6.85714C2.63004 6.85714 1.5 8.17045 1.5 9.64286H3.5C3.5 9.14282 3.86234 8.85714 4.16667 8.85714V6.85714ZM24.8333 21.25V25.7143H26.8333V21.25H24.8333ZM24.1667 26.5H5.83333V28.5H24.1667V26.5ZM5.16667 25.7143V21.25H3.16667V25.7143H5.16667ZM5.83333 26.5C5.52901 26.5 5.16667 26.2143 5.16667 25.7143H3.16667C3.16667 27.1867 4.29671 28.5 5.83333 28.5V26.5ZM24.8333 25.7143C24.8333 26.2143 24.4709 26.5 24.1667 26.5V28.5C25.7033 28.5 26.8333 27.1867 26.8333 25.7143H24.8333Z'
            },
            features: [
                'AI advisor for a day',
                '6 auto tracking',
                '5 Day transaction clearing',
                '24/7 Customer support'
            ]
        },
        {
            title: 'Enterprise Plan',
            price: '$500',
            svg: {
                viewBox: '0 0 28 28',
                path: 'M5.8 4.5C5.8 4.5 6.7 3.6 7.6 3.6C8.2 3.6 8.7 4.1 8.7 4.7V6.8C8.7 7.4 8.2 7.9 7.6 7.9C6.7 7.9 5.8 7.0 5.8 7.0M11.2 14.6C10.8 14.6 10.4 14.2 10.4 13.8C10.4 13.4 10.8 13.0 11.2 13.0C11.6 13.0 12.0 13.4 12.0 13.8C12.0 14.2 11.6 14.6 11.2 14.6M11.2 9.3C10.8 9.3 10.4 8.9 10.4 8.5C10.4 8.1 10.8 7.7 11.2 7.7C11.6 7.7 12.0 8.1 12.0 8.5C12.0 8.9 11.6 9.3 11.2 9.3M16.6 6.5C16.6 6.1 17.0 5.7 17.4 5.7C17.8 5.7 18.2 6.1 18.2 6.5C18.2 6.9 17.8 7.3 17.4 7.3C17.0 7.3 16.6 6.9 16.6 6.5M21.0 14.6C20.6 14.6 20.2 14.2 20.2 13.8C20.2 13.4 20.6 13.0 21.0 13.0C21.4 13.0 21.8 13.4 21.8 13.8C21.8 14.2 21.4 14.6 21.0 14.6M21.0 9.3C20.6 9.3 20.2 8.9 20.2 8.5C20.2 8.1 20.6 7.7 21.0 7.7C21.4 7.7 21.8 8.1 21.8 8.5C21.8 8.9 21.4 9.3 21.0 9.3M26.6 5.7C27.0 5.7 27.4 6.1 27.4 6.5C27.4 6.9 27.0 7.3 26.6 7.3C26.2 7.3 25.8 6.9 25.8 6.5C25.8 6.1 26.2 5.7 26.6 5.7M26.6 14.6C27.0 14.6 27.4 14.2 27.4 13.8C27.4 13.4 27.0 13.0 26.6 13.0C26.2 13.0 25.8 13.4 25.8 13.8C25.8 14.2 26.2 14.6 26.6 14.6M3.8 10.7C4.4 10.7 5.0 10.3 5.0 9.7C5.0 9.1 4.4 8.7 3.8 8.7C3.2 8.7 2.6 9.1 2.6 9.7C2.6 10.3 3.2 10.7 3.8 10.7M15.4 8.5C14.8 8.5 14.2 8.1 14.2 7.7C14.2 7.3 14.8 6.9 15.4 6.9C16.0 6.9 16.6 7.3 16.6 7.7C16.6 8.1 16.0 8.5 15.4 8.5M7.8 6.5C7.4 6.5 7.0 6.1 7.0 5.7C7.0 5.3 7.4 4.9 7.8 4.9C8.2 4.9 8.6 5.3 8.6 5.7C8.6 6.1 8.2 6.5 7.8 6.5'
            },
            features: [
                'AI advisor for a day',
                'Unlimited auto tracking',
                '24/7 Transaction clearing',
                '24/7 Customer support'
            ]
        }
    ];
    return (
        <section className="py-24 relative">
            <div className="absolute h-[36.5rem] w-full top-0 bg-gradient-to-r from-indigo-600 to-violet-600 -z-10"></div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="font-manrope text-5xl font-bold text-white mb-4">Suitable Pricing Plans</h2>
                    <p className="text-gray-300 text-xl leading-6">7 Days free trial. No credit card required.</p>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8 lg:space-y-0 lg:items-center">
                    {plans.map((plan, index) => (
                        <div key={index} className="group relative flex flex-col mx-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl transition-all duration-300 p-8 xl:p-12">
                            <div className="border-b border-gray-200 pb-9 mb-9">
                                <div className="w-16 h-16 rounded-full bg-indigo-50 mx-auto flex justify-center items-center transition-all duration-300 group-hover:bg-indigo-600">
                                    <svg className={`w-6 h-6 text-indigo-600 transition-all duration-300 group-hover:text-white`} viewBox={plan.svg.viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d={plan.svg.path} stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3 className="font-manrope text-2xl font-bold my-7 text-center text-indigo-600">{plan.title}</h3>
                                <div className="flex items-center justify-center">
                                    <span className="font-manrope text-4xl font-medium text-gray-900">{plan.price}</span>
                                    <span className="text-xl text-gray-500 ml-3">|&nbsp; Month</span>
                                </div>
                            </div>
                            <ul className="mb-12 space-y-6 text-left text-lg text-gray-600 group-hover:text-gray-900">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center space-x-3.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href="#" className="py-2.5 px-5 bg-indigo-50 shadow-sm rounded-full transition-all duration-500 text-base text-indigo-600 font-semibold text-center w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white">
                                Purchase Plan
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};



export default Plans;
