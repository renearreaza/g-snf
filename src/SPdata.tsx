import React from 'react';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import { Text } from '@fluentui/react';
import { config } from './Config';
import { getSharePointDataSubscriptions } from './GraphService';
import { Card, CardItem, CardSection } from '@fluentui/react-cards';
import 'office-ui-fabric-react/dist/css/fabric.css';



const container = {
    display: 'flex',
    justifyContent: 'center',
    margin: '10vh 0',
  };
  const styles = {
    cardStyles: {
      root: {
        background: 'white',
        padding: 10,
        borderTop: '5px solid #0078d4',
        width: '80%',
        maxWidth: '80%',
        height: '100%'
      }
    },
    card: {
      margin: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    header: {
      root: {
        fontSize: 20,
        fontWeight: 'bold',
      }
    }
  }

  type Data = {
    [key: string]: any;
  };

interface SharePointState {
    listLoaded: boolean;
    listItems: Data[];
  }

class SPdata extends React.Component<AuthComponentProps, SharePointState> {
    constructor(props: any) {
      super(props);
  
      this.state = {
        listLoaded: false,
        listItems: []
      };
    }

    async componentDidUpdate() {
        if (this.props.user && !this.state.listLoaded && !this.props.error)
        {
          try {
            // Get the user's access token
            var accessToken = await this.props.getAccessToken(config.scopes);
            // Get the user's news feed
            const spList = await getSharePointDataSubscriptions(accessToken);
            
            console.log(spList)
            // Update the array of news feed items in state
            this.setState({
                listLoaded: true,
                listItems: spList
            });
          }
          catch (err) {
            this.props.setError('ERROR', JSON.stringify(err));
            console.log(this.props.error);
            
          }
        }
      }
      render() {
        return (
          <div style={container}>
            {this.state.listItems.map(SP => {
              if (SP.ContentTypeID === 1) {
                return (
                <div className="s-Grid-col ms-sm3 ms-xl3" key={SP.ContentTypeID * Math.random()}>
                  <Card styles={styles.cardStyles}>
                  <CardSection>
                      <CardItem>
                        <Text styles={styles.header}>
                       {SP.Title}
                        </Text>
                        </CardItem>
                        <Text>
                            {SP.ContentDesc}
                        </Text>
                  </CardSection>
                  </Card>
                  </div>
                )}
                else if (SP.ContentTypeID === 2){
                  return(
                  <div className="s-Grid-col ms-sm3 ms-xl3" key={SP.ContentTypeID * Math.random()}>
                    <Card styles={styles.cardStyles}>
                    <CardSection>
                        <CardItem>
                          <Text styles={styles.header}>
                          Shaw News!
                          </Text>
                          <Text>
                          {SP.ContentDesc}
                          </Text>
                          </CardItem>
                    </CardSection>
                    </Card>
                    </div>
                  )}
                  else {
                    return (
                      <div>{SP.ContentDesc}</div>
                      )
                  }
            })}
            </div>
        );
      };
}

export default withAuthProvider(SPdata);