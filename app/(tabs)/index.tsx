import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet, // Importe StyleSheet para o Platform.OS se ele não estiver no seu styles.js
  Platform,
  FlatList, // Usaremos FlatList para renderizar os contatos
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarContatos } from '../../db/contatosDB'; // Certifique-se de que o caminho está correto
import { useRouter } from 'expo-router';
import styles from '@/styles/styles'; // Verifique se o caminho para seu styles.js está correto

const FeedScreen = () => {
  const router = useRouter();
  const [contatosImportantes, setContatosImportantes] = useState([]);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchContatos = async () => {
      try {
        const contatos = await listarContatos();
        // Você pode filtrar ou limitar a quantidade de contatos aqui se necessário
        // Por exemplo, para exibir apenas os 2 primeiros:
        setContatosImportantes((contatos as any).slice(0, 2));
      } catch (error) {
        console.error('Erro ao listar contatos:', error);
        // Opcional: Mostrar um alerta ou mensagem para o usuário
        // Alert.alert('Erro', 'Não foi possível carregar os contatos importantes.');
      }
    };

    fetchContatos();
  }, []); // O array vazio assegura que o efeito rode apenas uma vez ao montar o componente

  const handleVerMaisContatos = () => {
    // Redireciona para uma nova aba ou tela de "Todos os Contatos"
    // router.push('/contacts'); // Substitua '/contacts' pela rota real da sua tela de contatos
  };
  const handleVerMaisEventos = () => {
    // Redireciona para uma nova aba ou tela de "Todos os Contatos"
    // router.push('/contacts'); // Substitua '/contacts' pela rota real da sua tela de contatos
  };

  const renderInformationCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => {
        // Lógica para quando um contato individual é pressionado (opcional)
        console.log('Contato pressionado:', item.nome);
        // Ex: router.push(`/contact-details/${item.id}`);
      }}
    >
      <View style={styles.contactCardImagePlaceholder}>
        <Ionicons name="image-outline" size={30} style={styles.contactCardImagePlaceholderIcon} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.nome}</Text>
        <Text style={styles.contactLocation}>{item.localizacao}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color="#CFCFD1"
        style={styles.contactArrow}
      />
    </TouchableOpacity>
  );
  const renderEventCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => {
        // Lógica para quando um contato individual é pressionado (opcional)
        console.log('Contato pressionado:', item.nome);
        // Ex: router.push(`/contact-details/${item.id}`);
      }}
    >
      <View style={styles.contactCardImagePlaceholder}>
        <Ionicons name="image-outline" size={30} style={styles.contactCardImagePlaceholderIcon} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.nome}</Text>
        <Text style={styles.contactLocation}>{item.localizacao}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color="#CFCFD1"
        style={styles.contactArrow}
      />
    </TouchableOpacity>
  );
  const renderContactCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => {
        // Lógica para quando um contato individual é pressionado (opcional)
        console.log('Contato pressionado:', item.nome);
        // Ex: router.push(`/contact-details/${item.id}`);
      }}
    >
      <View style={styles.contactCardImagePlaceholder}>
        <Ionicons name="image-outline" size={30} style={styles.contactCardImagePlaceholderIcon} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.nome}</Text>
        <Text style={styles.contactLocation}>{item.localizacao}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color="#CFCFD1"
        style={styles.contactArrow}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Seção de Contatos Importantes */}
      <View style={styles.feedCardSection}>
        <View style={styles.feedCardHeader}>
          <Text style={styles.feedCardTitle}>Contatos importantes</Text>
          <TouchableOpacity style={styles.seeMoreButton} onPress={handleVerMaisContatos}>
            <Text style={styles.seeMoreButtonText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
        {contatosImportantes.length > 0 ? (
          <FlatList
            data={contatosImportantes}
            renderItem={renderContactCard}
            keyExtractor={(item) => item.id.toString()} // Assumindo que 'id' é um campo único na sua tabela
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text>Nenhum contato importante encontrado.</Text>
        )}
      </View>
      {/* Seção de Eventos */}
      <View style={styles.feedCardSection}>
        <View style={styles.feedCardHeader}>
          <Text style={styles.feedCardTitle}>Eventos</Text>
          <TouchableOpacity style={styles.seeMoreButton} onPress={handleVerMaisEventos}>
            <Text style={styles.seeMoreButtonText}>Ver mais</Text>
          </TouchableOpacity>
        </View>
        {eventos.length > 0 ? (
          <FlatList
            data={eventos}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()} // Assumindo que 'id' é um campo único na sua tabela
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text>Nenhum contato importante encontrado.</Text>
        )}
      </View>

      {/* Resto do seu FeedScreen pode vir aqui */}
      {/* <Text>Outros elementos da sua tela de Feed</Text> */}
    </View>
  );
};

export default FeedScreen;
