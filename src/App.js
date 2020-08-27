import React from 'react';
import './App.css';
import axios from 'axios'
import finance from './img/undraw_finance.png'
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import {
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonPage,
    IonToolbar, IonTitle, IonHeader,
    IonButton,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonInput
} from '@ionic/react';

class IonInputNumber extends React.Component{
    render() {
        const {valueNumber, changeNumber} = this.props
        return (
            <IonItem className="mt-2">
                <IonLabel position="floating">Entrez un nombre en Euro </IonLabel>
                <IonInput type="number" name="number" id="number"
                          value={valueNumber}
                          onIonChange={changeNumber}
                />
            </IonItem>
        );
    }
}
class OptionSelect extends React.Component{
    render() {
        const {data,index} = this.props
        return (
            <IonSelectOption value={index}>{data}</IonSelectOption>
        );
    }
}

class SelectMoney extends React.Component{
    render() {
        const {devise, selectDevise,selectDeviseChange} = this.props
        const listMoney= Object.entries(devise).map(([key,value]) => (
            <OptionSelect key={value} data={key} index={JSON.stringify({"dataNumber":value,"name":key})}/>
        ))
        return (
            <div>
                <IonSelect value={selectDevise}
                           placeholder="Selectionnez une devise"
                           onIonChange={selectDeviseChange}
                >
                    {listMoney}
                </IonSelect>
            </div>
        );
    }
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            devise:"",
            selectDevise:null,
            enterNumber:null,
            result:null,
            resultDevise:null,
            success:false,
            failed:false,
            error:null,
            compareArray:""
        };
        this.handleSelecDeviseChange= this.handleSelecDeviseChange.bind(this)
        this.handleNumberChange = this.handleNumberChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSelecDeviseChange(e){
        this.setState({
            selectDevise:e.target.value
        })
    }

    handleNumberChange(e){
        this.setState({
            enterNumber:e.target.value
        })
    }
    handleSubmit(){
        if (this.state.enterNumber !== null && this.state.enterNumber.trim() && this.state.selectDevise !== null){
            if (isNaN(this.state.enterNumber) !== true){
                this.state.compareArray.forEach(e => {
                    if (JSON.parse(this.state.selectDevise).dataNumber === e.dataNumber && JSON.parse(this.state.selectDevise).name === e.name){
                        this.setState({
                            success:true,
                            failed:false,
                            resultDevise:JSON.parse(this.state.selectDevise).name,
                            result:this.state.enterNumber * JSON.parse(this.state.selectDevise).dataNumber
                        })
                    }
                })
            }
            else{
                this.setState({
                    error: "Erreur lors du traitement de la conversion",
                    failed:true,
                    success:false
                })
            }
        }
        else{
            this.setState({
                error: "Entrez un nombre avant de convertir",
                failed:true,
                success:false
            })
        }
    }
    componentDidMount(){
        axios.get("https://api.exchangeratesapi.io/latest")
            .then(response=>{
                this.setState({
                    devise: response.data.rates
                })
                const array = []
                Object.entries(response.data.rates).forEach(([key,value]) =>{
                    array.push({'dataNumber':value,'name':key})
                })
                this.setState({
                    compareArray : array
                })
            })
    }

    render() {
        return (
            <div className="App">
                <IonPage>
                    <IonHeader>
                        <IonToolbar className="ionicBar">
                            <IonTitle>
                                Convert Euro €
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        <img src={finance} alt={finance}/>

                        <IonItem>
                            <IonLabel>Selectionnez la devise</IonLabel>
                            <SelectMoney
                                devise={this.state.devise}
                                selectDevise={this.state.selectDevise}
                                selectDeviseChange={this.handleSelecDeviseChange}
                            />
                        </IonItem>

                        <IonInputNumber valueNumber={this.state.enterNumber}
                                        changeNumber={this.handleNumberChange}
                        />

                        <IonButton onClick={this.handleSubmit} className="mt btnSubmit" expand="full">Convertir</IonButton>
                        {this.state.success  ?
                            <IonCard className="mt card mr-0 ml-0">
                                <IonCardHeader>
                                    <IonCardTitle>Result</IonCardTitle>
                                </IonCardHeader>
                                    <IonCardContent>
                                        {this.state.result} en {this.state.resultDevise}
                                    </IonCardContent>
                            </IonCard>
                            :""
                        }
                        { this.state.failed ?
                            <IonCard className="mt failed mr-0 ml-0">
                                <IonCardHeader>
                                    <IonCardTitle>Erreur</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    {this.state.error}
                                </IonCardContent>
                            </IonCard>
                            : ""
                        }
                    </IonContent>
                </IonPage>
            </div>
        );
    }
}

export default App;
