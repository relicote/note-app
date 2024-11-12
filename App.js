import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, AsyncStorage } from 'react-native';

export default function App() {

  const [estado, setEstado] = useState('Leitura');
  const [anotacao, setAnotacao] = useState('');

  useEffect(()=> {
    (async () => {
      try{
        const anotacaoLeitura = await AsyncStorage.getItem('anotacao')
        setAnotacao(anotacaoLeitura);
      }catch(error) {}
    })();
  }, [])

  setData = async () => {
    try{
      await AsyncStorage.setItem('anotacao', anotacao);
    }catch(error){
      
    }

    alert("Anotação salva com sucesso!");
  }
  function atualizarTexto() {
    setEstado('Leitura');
    setData();
  }

  if (estado == 'Leitura') {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style='light' />
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Aplicativo Anotação</Text>
        </View>
        {
        (anotacao != '')?
        <View style={{ padding: 20 }}><Text style={styles.anotacao}>{anotacao}</Text></View>
        :
        <View style={{ padding: 20 }}><Text style={{opacity: 0.3}}>Nenhuma anotação encontrada :(</Text></View>
        }
        <TouchableOpacity onPress={() => setEstado('Atualizando')} style={styles.btnAnotacao}>
          {
          (anotacao == "")?
            <Text style={styles.btnAnotacaoTexto}>+</Text>
            :
            <Text style={{fontSize: 12, color: "white", textAlign: "center", marginTop: 16}}>Editar</Text>
          }
        </TouchableOpacity>
      </View>
    );
  } else if (estado == "Atualizando") {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'iOs' ? 'padding' : 'height'}>
        <StatusBar style='light' />
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Aplicativo Anotação</Text>
        </View>
        <TextInput
          autoFocus={true}
          onChangeText={(text) => setAnotacao(text)}
          style={{ padding: 20, height: "70%", textAlignVertical: 'top', fontSize: 13 }}
          multiline={true}
          numberOfLines={5}
          value={anotacao}
        />
        <TouchableOpacity onPress={() => atualizarTexto()} style={styles.btnSalvar}>
          <Text style={{ textAlign: 'center', color: '#fff' }}>Salvar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 45,
    paddingBottom: 20,
    backgroundColor: '#069',
  },
  anotacao: {
    fontSize: 13,
  },
  btnAnotacao: {
    position: 'absolute',
    right: 30,
    bottom: 50,
    width: 50,
    height: 50,
    backgroundColor: '#069',
    borderRadius: 25,
  },
  btnAnotacaoTexto: {
    color: "white",
    position: "relative",
    textAlign: "center",
    top: 1.5,
    fontSize: 30
  },
  btnSalvar: {
    position: 'absolute',
    right: 30,
    bottom: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#069',
    borderRadius: 25,
  }
});
