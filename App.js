import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [estado, setEstado] = useState('Leitura');
  const [anotacoes, setAnotacoes] = useState([]);
  const [anotacaoAtual, setAnotacaoAtual] = useState('');
  const [editandoIndice, setEditandoIndice] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('anotacoes');
        if (dadosSalvos) setAnotacoes(JSON.parse(dadosSalvos));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const salvarAnotacoes = async (novasAnotacoes) => {
    try {
      await AsyncStorage.setItem('anotacoes', JSON.stringify(novasAnotacoes));
      setAnotacoes(novasAnotacoes);
    } catch (error) {
      console.error(error);
    }
  };

  const adicionarAnotacao = () => {
    const novasAnotacoes = [...anotacoes, anotacaoAtual];
    salvarAnotacoes(novasAnotacoes);
    setAnotacaoAtual('');
    setEstado('Leitura');
  };

  const editarAnotacao = () => {
    const novasAnotacoes = anotacoes.map((anotacao, index) => 
      index === editandoIndice ? anotacaoAtual : anotacao
    );
    salvarAnotacoes(novasAnotacoes);
    setAnotacaoAtual('');
    setEditandoIndice(null);
    setEstado('Leitura');
  };

  const excluirAnotacao = (index) => {
    Alert.alert(
      'Excluir anotação',
      'Tem certeza que deseja excluir esta anotação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            const novasAnotacoes = anotacoes.filter((_, i) => i !== index);
            salvarAnotacoes(novasAnotacoes);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const iniciarEdicao = (index) => {
    setEditandoIndice(index);
    setAnotacaoAtual(anotacoes[index]);
    setEstado('Atualizando');
  };

  if (estado === 'Leitura') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar style='light' />
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Aplicativo Anotação</Text>
        </View>
        {anotacoes.length > 0 ? (
          <FlatList
            data={anotacoes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.anotacaoContainer}>
                <Text style={styles.anotacao}>{item}</Text>
                <TouchableOpacity onPress={() => iniciarEdicao(index)} style={styles.btnEditar}>
                  <Text style={{ color: '#fff' }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluirAnotacao(index)} style={styles.btnExcluir}>
                  <Text style={{ color: '#fff' }}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={{ padding: 20 }}>
            <Text style={{ opacity: 0.3 }}>Nenhuma anotação encontrada :(</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setEstado('Atualizando')} style={styles.btnAnotacao}>
          <Text style={styles.btnAnotacaoTexto}>+</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (estado === 'Atualizando') {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'iOs' ? 'padding' : 'height'}>
        <StatusBar style='light' />
        <View style={styles.header}>
          <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Aplicativo Anotação</Text>
        </View>
        <TextInput
          autoFocus
          onChangeText={(text) => setAnotacaoAtual(text)}
          style={{ padding: 20, height: "70%", textAlignVertical: 'top', fontSize: 13 }}
          multiline
          numberOfLines={5}
          value={anotacaoAtual}
        />
        <TouchableOpacity
          onPress={editandoIndice === null ? adicionarAnotacao : editarAnotacao}
          style={styles.btnSalvar}
        >
          <Text style={{ textAlign: 'center', color: '#fff' }}>
            {editandoIndice === null ? 'Salvar' : 'Atualizar'}
          </Text>
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
  anotacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  anotacao: {
    fontSize: 13,
    flex: 1,
  },
  btnAnotacao: {
    position: 'absolute',
    right: 30,
    bottom: 50,
    width: 50,
    height: 50,
    backgroundColor: '#069',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAnotacaoTexto: {
    color: 'white',
    fontSize: 30,
    left: 1,
    bottom: 2
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
  },
  btnEditar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnExcluir: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  }
});
