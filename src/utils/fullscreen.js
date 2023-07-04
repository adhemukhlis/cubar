var elem = document.documentElement;
export const openFullScreen = ( ) => {
	if (!(( window.fullScreen ) || ( window.innerWidth === window.screen.width && window.innerHeight === window.screen.height ))) {
		if ( elem.requestFullscreen ) {
			elem.requestFullscreen( )
		} else if ( elem.mozRequestFullScreen ) {
			elem.mozRequestFullScreen( )
		} else if ( elem.webkitRequestFullscreen ) {
			elem.webkitRequestFullscreen( )
		} else if ( elem.msRequestFullscreen ) {
			elem.msRequestFullscreen( )
		}
	}
}
export const exitFullScreen = ( ) => {
	if (( window.fullScreen ) || ( window.innerWidth === window.screen.width && window.innerHeight === window.screen.height )) {
		if ( document.exitFullscreen ) {
			document.exitFullscreen( )
		} else if ( document.mozCancelFullScreen ) {
			document.mozCancelFullScreen( )
		} else if ( document.webkitExitFullscreen ) {
			document.webkitExitFullscreen( )
		} else if ( document.msExitFullscreen ) {
			document.msExitFullscreen( )
		}
	}
}