import DrawingBox from "./Drawing/DrawingBox.tsx";

const App = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
        }}>
            <h4>Холст</h4>
            <DrawingBox/>
        </div>
    )
};

export default App
