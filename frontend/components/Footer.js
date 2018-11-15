import React from 'react';
import { FooterStyles, FooterLogo } from './styles/FooterStyles';
import Link from 'next/link';

const Footer = () => (
  <FooterStyles>
    <FooterLogo>BackPackzz</FooterLogo>
    <div className='footer-cols'>
      <div>
        <h4>Around The Web</h4>
        <ul>
          <li>
            <a href='https://www.facebook.com/' target='_blank'>
              {' '}
              <i className='fab fa-facebook-f' /> facebook
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/' target='_blank'>
              <i className='fab fa-instagram' /> instagram
            </a>
          </li>
          <li>
            <a href='https://www.twitter.com/' target='_blank'>
              <i className='fab fa-twitter' /> twitter
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/shop'>
              <a>Shop</a>
            </Link>
          </li>
          <li>
            <Link href='/'>
              <a>About Us</a>
            </Link>
          </li>
          <li>
            <Link href='/'>
              <a>Customer Service</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4>NewsLetter</h4>
        <p>
          Subscribe to get special offers, free giveaways, and
          once-in-a-lifetime deals!(psst! this is just a placeholder!)
        </p>
        <div className='subscribe'>
          <input type='email' placeholder='your-email@example.com' />
          <input type='submit' value='SUBSCRIBE' />
        </div>
      </div>
    </div>
    <p>&copy; BackPackzz {new Date().getFullYear()} | All rights Reserved</p>
  </FooterStyles>
);

export default Footer;
