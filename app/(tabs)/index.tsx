import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db } from '../database'; // Importa a instância do banco de dados
import { styles } from '../styles/appStyles'; // Importa os estilos compartilhados

const FeedScreen = () => {
  const navigation = useNavigation();
  const [modulos, setModulos] = useState({
    informacoes: [],
    contatos: [],
    eventos: [],
  });

  const fetchModulos = useCallback(() => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM modulos;`,
        [],
        (_, { rows }) => {
          const fetchedModulos = {
            informacoes: [],
            contatos: [],
            eventos: [],
          };
          rows._array.forEach((item: any) => {
            if (fetchedModulos[item.tipo]) {
              fetchedModulos[item.tipo].push(item);
            }
          });
          setModulos(fetchedModulos);
        },
        (_, error) => console.error('Erro ao buscar módulos:', error)
      );
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchModulos();
    }, [fetchModulos])
  );

  const renderModulo = (title, type, data) => (
    <View style={styles.moduloContainer}>
      <Text style={styles.moduloTitle}>{title}</Text>
      {/* Exibe até 10 itens na página inicial */}
      {data.slice(0, 10).map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.moduloItem}
          onPress={() => navigation.navigate('ItemDetail', { item })}
        >
          <Text style={styles.moduloItemTitle}>{item.titulo}</Text>
          <Text style={styles.moduloItemContent}>{item.conteudo.substring(0, 50)}...</Text>
        </TouchableOpacity>
      ))}
      {/* Exibe o botão "Ver Mais" se houver mais de 10 itens */}
      {data.length > 10 && (
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => navigation.navigate('SeeMore', { type })}
        >
          <Text style={styles.seeMoreButtonText}>Ver Mais</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderModulo('Informações', 'informacoes', modulos.informacoes)}
      {renderModulo('Contatos', 'contatos', modulos.contatos)}
      {renderModulo('Eventos', 'eventos', modulos.eventos)}
    </ScrollView>
  );
};

export default FeedScreen;
