import { Result } from "antd"

const MobileUnsupportedPage = () => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
      <Result
        status="403"
        title={<div style={{ color: '#eee' }}>Mobile Unsupported</div>}
        subTitle={<div style={{ color: '#aaa' }}>Sorry, this app is not designed to run on mobile.</div>}
      />
    </div>
  )
}

export default MobileUnsupportedPage