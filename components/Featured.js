import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import { RevealWrapper } from "next-reveal";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  img.main {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;
const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;

const ContentWrapper = styled.div``;

export default function Featured({ product }) {
  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        <SwiperSlide>
          <Bg>
            <Center>
              <ColumnsWrapper>
                <Column>
                  <div>
                    <RevealWrapper origin={"left"} delay={0}>
                      <ContentWrapper>
                        <Title>{product.title}</Title>

                        <Desc>{product.description}</Desc>
                        <ButtonsWrapper>
                          <ButtonLink
                            href={"/product/" + product._id}
                            outline={1}
                            white={1}
                          >
                            Дэлгэрэнгүй
                          </ButtonLink>
                          <FlyingButton
                            white={1}
                            _id={product._id}
                            src={product.images?.[0]}
                          >
                            <CartIcon /> Нэмэх
                          </FlyingButton>
                        </ButtonsWrapper>
                      </ContentWrapper>
                    </RevealWrapper>
                  </div>
                </Column>
                <ImgColumn>
                  <RevealWrapper delay={0}>
                    <CenterImg>
                      <img
                        className={"main"}
                        src={product.images?.[0]}
                        alt=""
                      />
                    </CenterImg>
                  </RevealWrapper>
                </ImgColumn>
              </ColumnsWrapper>
            </Center>
          </Bg>
        </SwiperSlide>
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
      </Swiper>
    </>
  );
}
