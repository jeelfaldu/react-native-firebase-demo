/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react'
import { firebase, auth, firestore } from './src/firebase/config';

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    Alert, Modal,
    View, TextInput, TouchableOpacity
} from 'react-native';

import BootstrapStyleSheet from 'react-native-bootstrap-styles';
const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

const App = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState("");
    const [TodoList, setTodo] = useState([]);
    const [TodoText, setTodoText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const TODOREF = firestore().collection('todo'); // Create connect with 'todo' collection


    // Login
    const login = async () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                setUser(response.user.uid)
                //alert(response.user.uid)

            }).catch((error) => {
                alert(error)
            });
    }

    // Get TODO collectoin data
    async function GetTodoData() {
        TODOREF.onSnapshot(data => { // data is todo collection's all document
            let temp = []
            if (data) {
                data.forEach(doc => {

                    // Here doc is collection's document
                    // doc.is => To Get document ID 
                    // doc.data() => document feild data

                    temp.push({ id: doc.id, ...doc.data() })
                });
            }
            setTodo(temp)
        });

    }

    // Add TODO
    async function addData() {
        TODOREF.add({ text: TodoText }).then(() => {
            setTodoText('')
        }).catch((err) => {
            alert(err);
        })
    }

    // Remove TODO form list With firestore Doc id
    function remove(id) {
        TODOREF.doc(id).delete()
    }

    // logout
    function logOut() {
        auth().signOut()
        setUser("")
        setTodo([])
    }
    // When user login after auto call this function
    useEffect(() => {
        firebase.auth().onAuthStateChanged(data => {
            GetTodoData()
        })
    }, [])


    // if user login then view todo list otherwise login form
    if (user) {

        return (
            <>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, s.textCenter]}>
                            <Text style={styles.modalText, { textAlign: 'center', fontSize: 20, marginBottom: 45 }}> Are you sure want to logout 😥!</Text>
                            <View style={[s.dFlex, s.flexRow]}>
                                <TouchableOpacity
                                    style={[s.btn, s.btnOutlineDark]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={[s.textDark]}>😁 Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[s.btn, s.btnDanger, s.ml3, styles.button]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        logOut();
                                    }}
                                >
                                    <Text style={[s.textWhite]}>👋 Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={[s.body, s.w100, s.h100]}>

                    <SafeAreaView>
                        <ScrollView>
                            <View style={[s.dFlex, s.flexRow, s.p3, s.alignItemsCenter]}>
                                <Text style={[s.textCenter, s.textSuccess, { fontSize: 24 }]}>Todo 📃</Text>
                                <TouchableOpacity
                                    style={[s.flexEnd, s.btn, s.btnDanger, styles.btnLogout]}
                                    onPress={() => setModalVisible(true)}

                                >
                                    <Text style={[s.textWhite, s.p2]}>Logout</Text>
                                </TouchableOpacity>

                            </View>
                            {TodoList.map((name, i) => (
                                <View key={i} style={[s.card, s.dFlex, s.flexRow, s.m1, styles.shadow, { borderRadius: 16 }]}>
                                    <Text style={[s.text, s.cardBody, { color: "#000", fontSize: 20 }]}>
                                        {name.text}
                                    </Text>
                                    <TouchableOpacity
                                        style={[s.p4]}
                                        onPress={() => remove(name.id)}

                                    >
                                        <Text style={[s.textWarning]}>❌</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </SafeAreaView>
                    <View
                        style={[styles.footer, s.px3]}>
                        <TextInput
                            style={[styles.textInput]}
                            placeholder="Todo"
                            onChangeText={(text) => setTodoText(text)}
                            value={TodoText}
                            placeholderTextColor="#003f5c"
                        />
                        <TouchableOpacity style={[s.btn, s.btnSuccess, s.py3, s.mb2, styles.button]}
                            onPress={() => addData()}
                        >
                            <Text style={[s.btnText, s.textWhite]}>TODO </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )
    } else {

        return (
            <>


                <View style={[s.body, s.w100, s.h100]}>
                    <View style={[s.container, s.h100, s.w100, s.justifyContentCenter]}>
                        <Text style={[s.text, s.py5, { fontSize: 28 }]}>Login 🤓🚀🚀🚀</Text>

                        <TextInput
                            style={[styles.textInput]}
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholderTextColor="#003f5c"
                        />

                        <TextInput
                            style={[styles.textInput]}
                            placeholder="Password"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                        />
                        <TouchableOpacity style={[s.btn, s.btnSuccess, styles.button, s.my5, s.py3]}
                            onPress={() => login()}
                        >
                            <Text style={[s.btnText, s.textWhite]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    };
};


export default App;
const styles = StyleSheet.create({
    w100: {
        width: "100%"
    },
    btnLogout: {
        position: "absolute",
        right: 0
    },
    list: {
        paddingTop: 16,
        borderColor: '#9b9b9b',
        borderBottomWidth: 1,
        marginBottom: 16
    },
    textInput: {
        height: 60,
        fontSize: 20,
        borderColor: '#9b9b9b',
        borderBottomWidth: 1,
        marginTop: 8,
        marginVertical: 15,
    },

    footer: {
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        position: "absolute",
        bottom: 1,
        left: "5%",
        width: "90%",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.50,
        shadowRadius: 4,
        elevation: 5

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});