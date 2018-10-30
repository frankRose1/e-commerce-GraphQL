import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import SubTitle from './styles/SubTitleStyles';


const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($title: String!, $description: String!, $price: Int!, $image: String, $largeImage: String){
    createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage){
      id
    }
  }
`;

class Sell extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'backpacks');

    const res = await fetch('https://api.cloudinary.com/v1_1/dbviuyhby/image/upload', {
      method: 'POST',
      body: data
    });
    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  }

  handleInputChange = e => {
    const {name, value, type} = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }

  render() {
    return (
      <Mutation 
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}>
        {(createItem, {error, loading}) => (
          <>
            <SubTitle>List an Item For Sale</SubTitle>
            <Form
              data-test="sell-form"
              method="post" 
              onSubmit={async e => {
              e.preventDefault();

              const res = await createItem();
              this.setState({
                title: '',
                description: '',
                image: '',
                largeImage: '',
                price: 0
              });
              
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
            }}>
            
              <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error}/>
              <label htmlFor="file">
                  Image
                  <input 
                    type="file" 
                    id="file"
                    name="file"
                    placeholder="Add an image"
                    onChange={this.uploadFile}
                    required/>
                    {this.state.image && <img width="200" src={this.state.image} al="Upload Preview" />}
                </label>

                <label htmlFor="title">
                  Title
                  <input 
                    type="text" 
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={this.state.title}
                    onChange={this.handleInputChange}
                    required/>
                </label>

                <label htmlFor="price">
                  Price
                  <input 
                    type="number" 
                    id="price"
                    name="price"
                    placeholder="Price"
                    value={this.state.price}
                    onChange={this.handleInputChange}
                    required/>
                </label>

                <label htmlFor="description">
                  Description
                  <textarea 
                    type="text" 
                    id="description"
                    name="description"
                    placeholder="Enter a description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                    required/>
                </label>

                <button type="submit">Creat{loading ? 'ing' : 'e'} Item!</button>

              </fieldset>
            </Form>
          </>
        )}
      </Mutation>
    );
  }
}

export default Sell;
export {CREATE_ITEM_MUTATION};