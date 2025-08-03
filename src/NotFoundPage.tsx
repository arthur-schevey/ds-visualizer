import { Result } from "antd"

const NotFoundPage = () => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc'}}>
      <Result
        status="404"
        title={<div style={{ color: '#eee' }}>404</div>}
        subTitle={<div style={{ color: '#aaa' }}>Sorry, page not found.</div>}
      />
    </div>
  )
}

export default NotFoundPage