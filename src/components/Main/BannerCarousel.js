import React from 'react';
import axios from 'axios';
import { Button, List, Grid,Image } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const src = 'https://react.semantic-ui.com/images/wireframe/image.png'
class BannerCarousel extends React.Component {
    constructor(props) {
        var images = [];
        super();
        if(props.festivals!==undefined){
            images = props.festivals.map((festival,index)=>{
                return <Image key={index} className="festival-banner" src={festival.banner.length>0?"/assets/images/"+festival.banner[0].imageData:src} as={Link} to={`/news/view/${festival._id}`} />// festival.banner
            })
        }
        
        this.state = {
            value: 0,
            slides: images,
        };
        this.onchange = this.onchange.bind(this);
    }    
    onchange(value) {
      this.setState({ value });
    }
    render() { 
        const settings = {
          className: "center",
          centerMode: true,
          centerPadding: "60px",
          dots: true,
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          speed: 500,
          autoplaySpeed: 2000,
          cssEase: "linear"
        };
        return (
            <div className="slider-box">
                <Slider {...settings} >
                    {this.state.slides}
                    {this.state.slides}
                </Slider>
            </div>
        );
    }
}
export default BannerCarousel;
