import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarContatos, Contatos } from '../../services/contatos';
import { listarEventos, Eventos } from '../../services/eventos';
import { listarInformacoes, Informacoes } from '@/services/informacoes';
import styles from '@/styles/styles';

const INITIAL_ITEM_LIMIT = 3;
const LOAD_MORE_AMOUNT = 10;

const FeedScreen = () => {
  const [allContatos, setAllContatos] = useState<Contatos[]>([]);
  const [displayedContatos, setDisplayedContatos] = useState<Contatos[]>([]);
  const [contatosLimit, setContatosLimit] = useState(INITIAL_ITEM_LIMIT);
  const [loadingContatos, setLoadingContatos] = useState(true);

  const [allEventos, setAllEventos] = useState<Eventos[]>([]);
  const [displayedEventos, setDisplayedEventos] = useState<Eventos[]>([]);
  const [eventosLimit, setEventosLimit] = useState(INITIAL_ITEM_LIMIT);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const [allInformacoes, setAllInformacoes] = useState<Informacoes[]>([]);
  const [displayedInformacoes, setDisplayedInformacoes] = useState<Informacoes[]>([]);
  const [informacoesLimit, setInformacoesLimit] = useState(INITIAL_ITEM_LIMIT);
  const [loadingInformacoes, setLoadingInformacoes] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = useCallback(async (
    fetchFunction: () => Promise<any[]>,
    setAllData: React.Dispatch<React.SetStateAction<any[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      setAllData(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(listarContatos, setAllContatos, setLoadingContatos);
  }, [fetchData]);

  useEffect(() => {
    fetchData(listarEventos, setAllEventos, setLoadingEventos);
  }, [fetchData]);

  useEffect(() => {
    fetchData(listarInformacoes, setAllInformacoes, setLoadingInformacoes);
  }, [fetchData]);

  useEffect(() => {
    setDisplayedContatos(allContatos.slice(0, contatosLimit));
  }, [allContatos, contatosLimit]);

  useEffect(() => {
    setDisplayedEventos(allEventos.slice(0, eventosLimit));
  }, [allEventos, eventosLimit]);

  useEffect(() => {
    setDisplayedInformacoes(allInformacoes.slice(0, informacoesLimit));
  }, [allInformacoes, informacoesLimit]);

  const handleVerMais = (
    currentLimit: number,
    setLimit: React.Dispatch<React.SetStateAction<number>>,
    allDataLength: number
  ) => {
    const newLimit = currentLimit + LOAD_MORE_AMOUNT;
    setLimit(Math.min(newLimit, allDataLength));
  };

  const handleVerMenos = (
    setLimit: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setLimit(INITIAL_ITEM_LIMIT);
  };

  const openModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const convertDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };


  const renderCard = ({ item }: { item: Contatos | Eventos | Informacoes }) => (
    <TouchableOpacity
      style={styles.itemCard} 
      onPress={() => openModal(item)} 
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.local && <Text style={styles.itemLocation}>{item.local}</Text>}
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={24}
        color="#CFCFD1"
        style={styles.itemArrow} 
      />
    </TouchableOpacity>
  );

  const Section = ({
    title,
    data,
    displayedData,
    limit,
    setLimit,
    loading,
  }: {
    title: string;
    data: any[];
    displayedData: any[];
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
  }) => (
    <View style={styles.feedCardSection}>
      <View style={styles.feedCardHeader}>
        <Text style={styles.feedCardTitle}>{title}</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          limit < data.length ? (
            <TouchableOpacity style={styles.seeMoreButton} onPress={() => handleVerMais(limit, setLimit, data.length)}>
              <Text style={styles.seeMoreButtonText}>Ver mais</Text>
            </TouchableOpacity>
          ) : (
            data.length > INITIAL_ITEM_LIMIT && (
              <TouchableOpacity style={styles.seeMoreButton} onPress={() => handleVerMenos(setLimit)}>
                <Text style={styles.seeMoreButtonText}>Ver menos</Text>
              </TouchableOpacity>
            )
          )
        )}
      </View>
      {displayedData.length > 0 ? (
        <FlatList
          data={displayedData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id?.toString() || item.title}
          scrollEnabled={false}
        />
      ) : (
        !loading && <Text>Nenhum {title.toLowerCase()} encontrado.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ key: 'sections' }]}
        renderItem={() => (
          <>
            <Section
              title="Contatos importantes"
              data={allContatos}
              displayedData={displayedContatos}
              limit={contatosLimit}
              setLimit={setContatosLimit}
              loading={loadingContatos}
            />

            <Section
              title="Eventos"
              data={allEventos}
              displayedData={displayedEventos}
              limit={eventosLimit}
              setLimit={setEventosLimit}
              loading={loadingEventos}
            />

            <Section
              title="Informações"
              data={allInformacoes}
              displayedData={displayedInformacoes}
              limit={informacoesLimit}
              setLimit={setInformacoesLimit}
              loading={loadingInformacoes}
            />
          </>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItem ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalDescription}>{selectedItem.descricao}</Text>
                {selectedItem.telefone && (
                  <Text style={styles.modalLocation}>Telefone: {selectedItem.telefone}</Text>
                )}
                {selectedItem.data && (
                  <Text style={styles.modalLocation}>Data: {convertDate(selectedItem.data)}</Text>
                )}
                {selectedItem.local && (
                  <Text style={styles.modalLocation}>Local: {selectedItem.local}</Text>
                )}
              </ScrollView>
            ) : (
              <Text>Nenhum item selecionado.</Text>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={closeModal}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FeedScreen;