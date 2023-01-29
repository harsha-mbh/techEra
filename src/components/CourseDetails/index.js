import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CourseDetails extends Component {
  state = {courseData: '', apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.setState(
      {apiStatus: apiStatusConstants.loading},
      this.getCourseItemDetails,
    )
  }

  getCourseItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()

      const formattedData = {
        id: data.course_details.id,
        name: data.course_details.name,
        imageUrl: data.course_details.image_url,
        description: data.course_details.description,
      }
      this.setState({
        courseData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.setState(
      {apiStatus: apiStatusConstants.loading},
      this.getCourseItemDetails,
    )
  }

  renderCourseDetails = () => {
    const {courseData} = this.state
    const {imageUrl, name, description} = courseData
    return (
      <div className="course-details-page-container">
        <div className="course-details-card">
          <img src={imageUrl} alt={name} className="course-logo" />
          <div className="name-description-container">
            <h1 className="name">{name}</h1>
            <p className="description">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="page-heading">Oops! Something Went Wrong</h1>
      <p className="page-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderCourseDetails()
      case 'FAILURE':
        return this.renderFailureView()
      case 'LOADING':
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default CourseDetails
