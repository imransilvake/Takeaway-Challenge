// react
import React from 'react';

// app
import loaderGif from '../../../assets/svg/loader.svg';

const Loading = () => {
	return (
		<section className="tc-loading-animation tc-position-fixed tc-normal">
			<img src={loaderGif} alt="loader" />
		</section>
	)
};

export default Loading;
