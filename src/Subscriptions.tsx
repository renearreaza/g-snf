import React from 'react';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import 'office-ui-fabric-react/dist/css/fabric.css';
import { Jumbotron, Table, Button } from 'reactstrap';


type Data = {
    [key: string]: any;
  };

interface SubscriptionState {
    listLoaded: boolean;
    listItems: Data[];
  }

class Subscriptions extends React.Component<AuthComponentProps, SubscriptionState> {
    constructor(props: any) {
      super(props);
  
      this.state = {
        listLoaded: false,
        listItems: []
      };
    }

    render() {
        return (
            <div className="container">
                <Jumbotron>
                    <h4>Hello, {this.props.user.displayName}</h4>
                    <p>Your current subscriptions are listed below.</p>
                </Jumbotron>
                <Table size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Source</th>
                        <th>Description</th>
                        <th>Total Articles</th>
                        <th>Subscribed</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Shaw</td>
                        <td>All things Shaw. Important news, fun events, and much more!</td>
                        <td>32</td>
                        <td>true</td>
                        <td><Button outline color="primary">Unsubscribe</Button></td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Microsoft</td>
                        <td>Blogs, Announcements and documentation that you may need to know.</td>
                        <td>9</td>
                        <td>true</td>
                        <td><Button outline color="primary">Unsubscribe</Button></td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>GameStop</td>
                        <td>Rocket launch pending.... check back soon.</td>
                        <td>68419</td>
                        <td>true</td>
                        <td><Button outline color="primary">Unsubscribe</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default withAuthProvider(Subscriptions);