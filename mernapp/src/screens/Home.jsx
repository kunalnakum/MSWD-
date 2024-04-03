import React, { useState , useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";


export default function Home() {


  const [search,setSearch] = useState('');
  const [productCat,setproductCat] = useState([]);
  const [productItem,setproductItem] = useState([]);

  const loadData = async ()=>{
    let response = await fetch("http://localhost:5000/api/productData",{
      method:"POST",
      headers:{
        'Content-Type' : 'application/json'
      }
    });
    response = await response.json();

    setproductItem(response[0]);
    setproductCat(response[1]);




    // console.log(response[0] , response[1])
  }


  useEffect(()=>{
    loadData()
  },[])
  






  return (
    <>
      <div>
        <Navbar />
      </div>

      <div>
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" style={{objectFit:"contain !important"}}>
  <div className="carousel-inner" id='carousel'>
    <div className="carousel-caption" style={{zIndex:"10"}}>
    <div className="d-flex justify-content-center">
      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
      <button className="btn btn-outline-success text-white bg-success" type="submit">Search</button>
    </div>
    </div>
    <div className="carousel-item active">
      <img src="https://source.unsplash.com/random/900×700/?cooking_oil" style={{filter:"brightness(30%)"}} className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="https://source.unsplash.com/random/900×700/?grains" style={{filter:"brightness(30%)"}} className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="https://source.unsplash.com/random/900×700/?grocery" style={{filter:"brightness(30%)"}} className="d-block w-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
      </div>

      <div className="container">
      {
  productCat.length !== 0
    ? productCat.map((data) => {
        return (
          <div className="row mb-3">
            <div key={data._id} className="fs-3 m-3">
              {data.CategoryName}
            </div>
            <hr />
            {productItem.length !== 0
              ? productItem
                  .filter(
                    (item) =>
                      item.CategoryName === data.CategoryName &&
                      item.name.toLowerCase().includes(search.toLocaleLowerCase())
                  )
                  .map((filterItems) => {
                    return (
                      <div key={filterItems._id} className="col-12 col-md-6 col-lg-3">
                        <Card
                          productItem={filterItems}
                          options={filterItems.options[0]}
                        ></Card>
                      </div>
                    );
                  })
              : <div>No data found</div>}
          </div>
        );
      })
    : <div>Not Rendering</div>
}

        
        
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}
