import React from 'react';
import {Helmet} from "react-helmet-async"; // Helmet is a library that allows you to manage the document head of your application.

const Title = ({
                 title = "NoviConnect",
                 description = "Name of this chatting app is NoviConnect."
               }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name={"description"} content={description}/>
    </Helmet>
  );
};

export default Title;