// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icon/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }
  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarData = fetchedData.similar_products.map(eachData =>
        this.getFormattedData(eachData),
      )
      this.setState({
        productData: updatedData,
        similarProductData: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => {
    const {productData, quantity, similarProductData} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productData
    return (
      <div>
        <div>
          <img src={imageUrl} alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div>
              <div>
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <div>
              <p>Avaliable:</p>
              <p>{availability}</p>
            </div>
            <div>
              <p>Brand:</p>
              <p>{brand}</p>
            </div>
            <hr />
            <div>
              <button
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare classname="icon" />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare classname="icon" />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul>
          {similarProductData.map(data => (
            <SimilarProductItem productDetails={data} key={data.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
