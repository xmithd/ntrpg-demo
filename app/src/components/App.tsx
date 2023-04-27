import { Layout, theme } from 'antd';
import { DutiesComponent } from './DutiesComponent';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Header>
        <div style={{color: 'white'}}>NTRPG-demo</div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ background: colorBgContainer }}>
          <DutiesComponent />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2023 NTRPG-demo</Footer>
    </Layout>
  );
};

export default App;
