import React from 'react';


// Definición de la interfaz para los elementos de imagen
interface ImageItem {
    url: string;
    alt: string;
}

// Props del componente Carousel
interface CarouselProps {
    images: ImageItem[];
}

const Slides: React.FC<CarouselProps> = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            {/* <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img src={image.url} alt={image.alt} style={{ width: '100%', height: 'auto' }} />
                    </div>
                ))}
            </Slider> */}
        </div>
    );
};

export default Slides;