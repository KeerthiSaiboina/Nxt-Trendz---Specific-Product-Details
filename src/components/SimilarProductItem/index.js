// Write your code here
import './index.css'

const SimilarProductItem=(props)=>{
    const {productDetails} = props
    const {title,brand,imageUrl,rating,price} = productDetails

    return (
        <li className="similar-item">
     
        <img src={imageUrl} alt={`similar product ${title}`} className="thumbnail" />
        <p className="title">{title}</p>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
     
    </li>
    )
}