import React from 'react';
import './Footer.css'
const copyToClipBoard = () =>{
    let tempInput = document.createElement("input");
    tempInput.value = 'darshan.jain@outlook.in';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}
const Footer = ({popup}) => {
  return(
      <>
      <div className="contact">
          <div className="foot">
              Contact Developer :
          </div>
          <div className="icons">
              <a href="https://www.linkedin.com/in/darshan-jain-4b316b1b9/"  target="_blank" rel="noopener noreferrer"><span className="fa fa-linkedin icon"></span></a>
              <a href="https://www.instagram.com/darshan_jain29/" target="_blank" rel="noopener noreferrer"><span  className="fa fa-instagram icon"></span></a>
              <i className="fa fa-envelope icon mail" onClick={()=>{copyToClipBoard(); popup('Email Copied to Clipboard!',1100);}}></i>
          </div>
      </div>
      </>
  );
}

export default Footer;