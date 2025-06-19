import homeStyles from './home.module.css';
import { Input, Button } from '@linktivity/link-ui';

const HomeView = () => {
  return (
    <div className={homeStyles.home}>
      <Input
        className={homeStyles.input}
        style={{ textAlign: 'center' }}
        defaultValue={'5:00'}
      />
      <div>
        <Button className={homeStyles.button} variant="outlined">
          {'+0:30'}
        </Button>
        <Button className={homeStyles.button} variant="outlined">
          {'+1:00'}
        </Button>
        <Button className={homeStyles.button} variant="outlined">
          {'+5:00'}
        </Button>
      </div>
      <div>
        <Button className={homeStyles.button} variant="outlined">
          {'▶'}
        </Button>
      </div>
    </div>
  );
};

export default HomeView;
