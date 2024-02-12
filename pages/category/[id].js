import Header from "@/components/Header";
import Title from "@/components/Title";
import Center from "@/components/Center";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from "next-reveal";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color: #444;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: #444;
  }
`;
const ParentCatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
  parentCategory,
  parentCatProducts,
}) {
  const defaultSorting = "_id-desc";
  const defaultFilterValues = category.properties.map((p) => ({
    name: p.name,
    value: "all",
  }));
  const [products, setProducts] = useState(originalProducts);
  const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues((prev) => {
      return prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }
  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true);
    const catIds = [category._id, ...(subCategories?.map((c) => c._id) || [])];
    const params = new URLSearchParams();
    params.set("categories", catIds.join(","));
    params.set("sort", sort);
    filtersValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoadingProducts(false);
    });
  }, [filtersValues, sort, filtersChanged]);
  return (
    <>
      <Header />
      <Center>
        <Title>{category.name}</Title>

        <CategoryHeader>
          <FiltersWrapper>
            {category.properties.map((prop) => (
              <Filter key={prop.name}>
                <span>{prop.name}:</span>
                <select
                  onChange={(ev) =>
                    handleFilterChange(prop.name, ev.target.value)
                  }
                  value={filtersValues.find((f) => f.name === prop.name).value}
                >
                  <option value="all">All</option>
                  {prop.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </Filter>
            ))}
            <Filter>
              <span>Эрэмбэлэх:</span>
              <select
                value={sort}
                onChange={(ev) => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}
              >
                <option value="price-asc">үнэ, хамгийн бага нь эхлээд</option>
                <option value="price-desc">үнэ, хамгийн өндөр нь</option>
                <option value="_id-desc">Шинээр нэмэгдсэн</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </Filter>
          </FiltersWrapper>
        </CategoryHeader>
        {/* parent categories */}
        {loadingProducts && <Spinner fullWidth />}
        {!loadingProducts && (
          <ParentCatGrid>
            {parentCategory.map((parent) => (
              <div key={parent.name}>
                <Title>{parent.name}</Title>
                <div>
                  <CategoryGrid>
                    {parentCatProducts[parent._id].map((p, index) => (
                      <RevealWrapper key={index} delay={index * 50}>
                        <div>{p.title}</div>
                        <ProductBox {...p} />
                      </RevealWrapper>
                    ))}
                  </CategoryGrid>
                </div>
              </div>
            ))}
          </ParentCatGrid>
        )}

        {/* {loadingProducts && <Spinner fullWidth />}
        {!loadingProducts && (
          <div>
            {products.length > 0 && <ProductsGrid products={products} />}
            {products.length === 0 && (
              <div>Уучлаарай, бүтээгдэхүүн олдсонгүй</div>
            )}
          </div>
        )} */}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map((c) => c._id)];
  const products = await Product.find({ category: catIds });
  // parent
  const categories = await Category.find();
  const parentCategory = categories.filter((c) => c.parent);
  const parentCatProducts = {};
  for (const parentCatId of parentCategory) {
    const product = await Product.find({ category: parentCatId._id }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    parentCatProducts[parentCatId._id] = product;
  }
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
      parentCategory: JSON.parse(JSON.stringify(parentCategory)),
      parentCatProducts: JSON.parse(JSON.stringify(parentCatProducts)),
    },
  };
}
