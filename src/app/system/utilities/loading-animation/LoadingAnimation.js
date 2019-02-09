// react
import React from 'react';

// app
import loaderGif from '../../../../assets/svg/loader.svg';

const LoadingAnimation = () => {
	return (
		<section className="sc-loading-animation tc-view-height">
			<img src={loaderGif} alt="loader" />
		</section>
	)
};

export default LoadingAnimation;
