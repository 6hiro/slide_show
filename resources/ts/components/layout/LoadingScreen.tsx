import React from 'react';

const LoadingScreen: React.FC = () => {
	return (
		<div className="loading_screen_wrapper">
			<div className="loader__ball"></div>
			<div className="loader__ball"></div>
			<div className="loader__ball"></div>
			<div className="loader__ball"></div>
		</div>
	)
};

export default LoadingScreen;