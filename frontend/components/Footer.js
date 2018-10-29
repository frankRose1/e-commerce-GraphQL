import React from 'react';
import {FooterStyles, FooterLogo} from './styles/FooterStyles';
import Link from 'next/link';

const Footer = () => (
  <FooterStyles>
    <FooterLogo>BackPackzz</FooterLogo>
    <div className="footer-cols">
      <div>
        <h3>Around The Web</h3>
        <ul>
          <li>
            <a href="https://www.facebook.com/" target="_blank"> <i class="fab fa-facebook-f"></i> facebook</a>
          </li>
          <li>
            <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i> instagram</a>
          </li>
          <li>
            <a href="https://www.twitter.com/" target="_blank"><i class="fab fa-twitter"></i> twitter</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>Company</h3>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/shop">
              <a>Shop</a>
            </Link>
          </li>
          <li>
            <Link href="">
              <a>About Us</a>
            </Link>
          </li>
          <li>
            <Link href="/service">
              <a>Customer Service</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h3>NewsLetter</h3>
        <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals!(psst! this is just a placeholder!)</p>
        <div className="subscribe">
          <input type="email" placeholder="your-email@example.com"/>
          <input type="submit" value="SUBSCRIBE"/>
        </div>
      </div>
    </div>
    <p>&copy; BackPackzz {new Date().getFullYear()} | All rights Reserved</p>
  </FooterStyles>
);

export default Footer;