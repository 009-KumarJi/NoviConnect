import React from 'react';
import {Helmet} from "react-helmet-async";

const Title = ({
                 title = "NoviConnect",
                 description = "Name of the app is NoviConnect."
               }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name={"description"} content={description}/>
    </Helmet>
  );
};

export default Title;