export const white = '#fff'
export const whitegrey = '#fafafa'
export const black = '#223'
export const IconBlack = 'rgba(0, 0, 0, 0.87)'
export const blue = '#36a2eb'
export const darkblue = '#10455b'
export const green = '#82de3a'
export const red = '#ef3a79'
export const yellow = '#ffce4d'
export const IconSizeQuestion = '16vw'
export const IconSizeRPS = '20vh'
export const RPSButtonSize = '8vh'
export const FMASIconSize = '4vh'
export const FillHeight = {
	minHeight: '100vh'
}
export const FullHeight = {
	minHeight: '100vh'
}
export const HalfHeight = {
	minHeight: '50vh'
}
export const TextCenter = {
	margin: '20px',
	textAlign: 'center'
}
export const Flex1JustifyCenter = {
	display: 'flex',
	flex: 1,
	justifyContent: 'center'
}
export const UsernameMenuText = {
	textAlign: 'center',
	width: '90vw',
	lineHeight: '4vh',
	whiteSpace: 'normal',
	fontSize: '4vh',
	marginTop: '5vh',
	marginBottom: '2vh'
}
export const CenteredContent = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center'
}
export const ProfileContainer = {
	...CenteredContent,
	...HalfHeight,
	backgroundColor: yellow,
	color: white,
	justifyContent: 'center'
}
export const GridContainer = {
	backgroundColor: whitegrey,
	flex: 1,
	width: '100%',
	display: 'flex',
	flexFlow: 'wrap',
	flexDirection: 'row',
	justifyContent: 'space-evenly',
	paddingBottom: '4rem'
}
export const GridItem = {
	marginTop: '6vw',
	backgroundColor: '#fff',
	padding: '6vw',
	width: '40vw',
	height: '40vw',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-evenly'
}
export const InfoButtonStyle = {
	position: 'absolute',
	width: '90vw',
	top: 10,
	display: 'flex',
	justifyContent: 'flex-end',
	fontSize: '2vh'
}
export const LoginContainer = {
	...CenteredContent,
	...FillHeight,
	backgroundColor: yellow,
	justifyContent: 'center'
}
export const TrainingContainer = {
	backgroundColor: whitegrey,
	...CenteredContent,
	...FullHeight,
	justifyContent: 'center'
}
export const TestingContainer = {
	backgroundColor: whitegrey,
	...CenteredContent,
	minHeight: '100vh',
	justifyContent: 'center'
}
export const ButtonLoginContainer = {
	width: '35vh'
}
export const UnsupportedContainer = {
	...CenteredContent,
	...FullHeight,
	backgroundColor: yellow,
	justifyContent: 'center'
}
export const HeadLogo = {
	width: '35vh',
	marginBottom: '20vh'
}
export const ContainerCenterBasicScrollable = {
	backgroundColor: whitegrey,
	...FullHeight,
	...CenteredContent,
	paddingTop: '4vh',
	paddingBottom: '10vh'
}
export const ContainerCenterBasic = {
	backgroundColor: whitegrey,
	...FullHeight,
	...CenteredContent,
	justifyContent: 'center'
}
export const ResttimeStyle = {
	width: '60px'
}
export const CountdownGame = {
	position: 'absolute',
	top: 0,
	right: 0,
	width: '60px'
}
export const CountdownText = {
	position: 'absolute',
	width: '60px',
	height: '60px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}
export const ScoreGame = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '60px'
}
export const ChalStyle = {
	fontSize: IconSizeQuestion,
	display: 'flex',
	minHeight: '24vh',
	alignItems: 'center',
	margin: '5vh',
	justifyContent: 'center',
	color: black
}
export const ChalHOLStyle = {
	fontSize: IconSizeQuestion,
	marginBottom: '10vh'
}
export const ChalFMASStyle = (data) => {
	return {
		fontSize: '9vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: data === 0 ? red : blue
	}
}
export const Top = {
	position: 'absolute',
	top: 0
}
export const Bottom = {
	position: 'absolute',
	bottom: 0
}
export const Right = {
	position: 'absolute',
	right: 0
}
export const Left = {
	position: 'absolute',
	left: 0
}
export const FMASButtonSize = {
	TopBottom: {
		width: '50vw'
	},
	LeftRight: {
		height: '50vh'
	}
}
export const ButtonSimStyle = {
	backgroundColor: white,
	display: 'flex',
	justifyContent: 'center',
	padding: '20px 20px',
	marginTop: 20,
	width: '40vh'
}
export const ButtonFontSize = {
	fontSize: '5vh',
	fontWeight: 400
}
export const ButtonMargin = {
	marginTop: '6vw',
	backgroundColor: '#fff',
	padding: '4vw',
	width: '26.6vw',
	height: '26.6vw',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'space-evenly'
}
