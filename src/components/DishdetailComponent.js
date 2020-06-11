/* Imports */
import React, { Component } from "react";

import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button,
     Modal, ModalBody,ModalHeader,Label ,Row,Col} from 'reactstrap';
import {LocalForm, Control, Errors} from "react-redux-form";
import { Link } from 'react-router-dom';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
  constructor(props){
    super(props);
    this.state={
      isModalopen:false
    }
    this.toggleModal= this.toggleModal.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
  }

  toggleModal(){
    this.setState({
      isModalopen:!this.state.isModalopen
    });
  }
  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating ,values.yourname,values.message);
    // event.preventDefault();
  }

  render(){
    return(
      <>
      <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>

      <Modal isOpen={this.state.isModalopen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>
          Submit Comment
        </ModalHeader>
        <ModalBody>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <div className="form-group">
              <Label htmlFor="rating">Rating</Label>
              <Control.select model=".rating" name="rating" id="rating"
                className="form-control">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
              </Control.select>
            </div>
            <div className="form-group">
              <Label htmlFor="yourname">Your Name</Label>
              <Control.text model=".yourname" id="yourname" name="yourname" 
                validators={{
                  required, minLength: minLength(3), maxLength: maxLength(15)
               }}
                placeholder="Your Name" className="form-control" />
                <Errors
                  className="text-danger"
                  model=".yourname"
                  show="touched"
                  messages={{
                      required: '*Required-',
                      minLength: 'Must be greater than 2 characters',
                      maxLength: 'Must be 15 characters or less'
                  }}
                />
            </div>
            <div className="form-group">
              <Label htmlFor="message">Comment</Label>
              <Control.textarea model=".message" id="message" name="message" className="form-control" rows="12" />
            </div>
            <div className="form-group">
              <Button type="submit" color="primary">Submit</Button>
          
            </div>
            </LocalForm>
        </ModalBody>
      </Modal>
      </>
    );
  }
}
  function RenderDish({dish}) {
    if (dish != null) {
      return (
        <FadeTransform
          in
          transformProps={{
              exitTransform: 'scale(0.5) translateY(-50%)'
          }}>
        <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
        </FadeTransform>
      );
    } else {
      return <div></div>;
    }
  }

  /* Component to render the comments of the selected dish */

  function RenderComments({dishComments,postComment,dishId}) {
    if (dishComments != null) {
      return (
        <div>
          <h4>Comments</h4>
          <ul className="list-unstyled">
          <Stagger in>
              {dishComments.map((comment) => {
                  return (
                      <Fade in>
                      <li key={comment.id}>
                      <p>{comment.comment}</p>
                      <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                      </li>
                      </Fade>
                  );
              })}
              </Stagger>
            <li>
              <CommentForm dishId={dishId} postComment={postComment} />
            </li>
          </ul>
          
        </div>
      );
    } else {
      return (
        <>
        <div>comments</div>
        <CommentForm />
        </>
      );
    }
  }




/* Dishdetail component class */
 const Dishdetail = (props) => {

    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    } 
    else if (props.dish != null) {
        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>

                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments dishComments={props.comments}
                    postComment={props.postComment} 
                    dishId={props.dish.id}/>
                </div>
            </div>
            </div>
        );
    } else {
      return <div></div>;
    }
}

/* export Dishdetail component */
export default Dishdetail;