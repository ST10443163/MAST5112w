import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// TypeScript Interfaces
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  course: CourseType;
}

type CourseType = 'Starters' | 'Mains' | 'Dessert' | 'Drinks';

interface NewMenuItemState {
  name: string;
  description: string;
  price: string;
  course: CourseType;
}

interface CourseStats {
  course: CourseType;
  count: number;
  averagePrice: number;
}

interface AveragePriceData {
  course: CourseType;
  average: number;
  count: number;
}

// Stack Navigator Type
type RootStackParamList = {
  Home: undefined;
  ManageMenu: undefined;
  FilterMenu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Home Screen Component
const HomeScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  // Get menuItems from route params or use empty array as fallback
  const menuItems: MenuItem[] = route.params?.menuItems || [];
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTotalMenuItems = (): number => {
    return menuItems.length;
  };

  const getCourseStats = (): CourseStats[] => {
    const courses: CourseType[] = ['Starters', 'Mains', 'Dessert', 'Drinks'];
    
    return courses.map(course => {
      const courseItems = menuItems.filter(item => item.course === course);
      const count = courseItems.length;
      
      let averagePrice = 0;
      if (count > 0) {
        const totalPrice = courseItems.reduce((sum, item) => sum + item.price, 0);
        averagePrice = totalPrice / count;
      }
      
      return {
        course,
        count,
        averagePrice
      };
    }).filter(stat => stat.count > 0);
  };

  const getAveragePriceData = (): AveragePriceData[] => {
    const courses: CourseType[] = ['Starters', 'Mains', 'Dessert', 'Drinks'];
    
    return courses.map(course => {
      const courseItems = menuItems.filter(item => item.course === course);
      const count = courseItems.length;
      
      let average = 0;
      if (count > 0) {
        const totalPrice = courseItems.reduce((sum, item) => sum + item.price, 0);
        average = totalPrice / count;
      }
      
      return {
        course,
        average,
        count
      };
    }).filter(data => data.count > 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Animated.View 
      style={[
        styles.menuCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <View style={styles.menuHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.courseContainer}>
        <Text style={styles.itemCourse}>{item.course}</Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Text style={styles.headerTitle}>Christoffel's Kitchen</Text>
        <Text style={styles.headerSubtitle}>Private Chef Menu</Text>
      </Animated.View>

      {/* Menu Statistics */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Text style={styles.totalItemsText}>
          Total Menu Items: {getTotalMenuItems()}
        </Text>
        
        {/* Average Prices */}
        {getTotalMenuItems() > 0 && (
          <View style={styles.averagePriceContainer}>
            <Text style={styles.averagePriceTitle}>Average Prices by Course:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.averagePriceScroll}>
              {getAveragePriceData().map((data) => (
                <View key={data.course} style={styles.averagePriceItem}>
                  <Text style={styles.averagePriceCourse}>{data.course}</Text>
                  <Text style={styles.averagePriceValue}>${data.average.toFixed(2)}</Text>
                  <Text style={styles.averagePriceCount}>({data.count} items)</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.actionButtonsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButton, styles.manageButton]}
          onPress={() => navigation.navigate('ManageMenu', { menuItems })}
        >
          <Text style={styles.actionButtonText}>Manage Menu</Text>
        </TouchableOpacity>
        
        {menuItems.length > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.filterButton]}
            onPress={() => navigation.navigate('FilterMenu', { menuItems })}
          >
            <Text style={styles.actionButtonText}>Filter by Course</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Menu List or Empty State */}
      {menuItems.length === 0 ? (
        <Animated.View 
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.emptyStateTitle}>No Menu Items Yet</Text>
          <Text style={styles.emptyStateText}>
            Start building your menu by adding your first dish!
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('ManageMenu', { menuItems: [] })}
          >
            <Text style={styles.emptyStateButtonText}>Create Your First Item</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item: MenuItem) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Manage Menu Screen Component
const ManageMenuScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const initialMenuItems: MenuItem[] = route.params?.menuItems || [];
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [newMenuItem, setNewMenuItem] = useState<NewMenuItemState>({
    name: '',
    description: '',
    price: '',
    course: 'Starters'
  });

  const courses: CourseType[] = ['Starters', 'Mains', 'Dessert', 'Drinks'];
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const addMenuItem = (): void => {
    if (!newMenuItem.name.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }
    if (!newMenuItem.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!newMenuItem.price.trim()) {
      Alert.alert('Error', 'Please enter a price');
      return;
    }

    const priceValue = parseFloat(newMenuItem.price.replace(/[^0-9.]/g, ''));
    if (isNaN(priceValue)) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const item: MenuItem = {
      ...newMenuItem,
      price: priceValue,
      id: Date.now().toString(),
    };

    const updatedItems = [...menuItems, item];
    setMenuItems(updatedItems);
    
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      course: 'Starters'
    });
    
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const deleteMenuItem = (id: string): void => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this item from the menu?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: (): void => {
            setMenuItems(menuItems.filter(item => item.id !== id));
          },
        },
      ]
    );
  };

  const goBackToHome = (): void => {
    navigation.navigate('Home', { menuItems });
  };

  const renderManageMenuItem = ({ item }: { item: MenuItem }) => (
    <Animated.View 
      style={[
        styles.manageMenuCard,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.manageMenuHeader}>
        <View style={styles.manageMenuInfo}>
          <Text style={styles.manageItemName}>{item.name}</Text>
          <Text style={styles.manageItemCourse}>{item.course}</Text>
          <Text style={styles.manageItemDescription}>{item.description}</Text>
        </View>
        <View style={styles.manageMenuActions}>
          <Text style={styles.manageItemPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(): void => deleteMenuItem(item.id)}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={goBackToHome}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Menu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.manageContainer}>
        {/* Add Item Form */}
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Add New Menu Item</Text>
          
          {/* Dish Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter dish name"
              value={newMenuItem.name}
              onChangeText={(text: string): void => setNewMenuItem({...newMenuItem, name: text})}
              maxLength={50}
            />
          </View>
          
          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the dish, ingredients, etc."
              value={newMenuItem.description}
              onChangeText={(text: string): void => setNewMenuItem({...newMenuItem, description: text})}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>
          
          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 25.00"
              value={newMenuItem.price}
              onChangeText={(text: string): void => setNewMenuItem({...newMenuItem, price: text})}
              keyboardType="decimal-pad"
            />
          </View>
          
          {/* Course Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Course *</Text>
            <View style={styles.courseSelection}>
              {courses.map((course: CourseType) => (
                <TouchableOpacity
                  key={course}
                  style={[
                    styles.courseOption,
                    newMenuItem.course === course && styles.courseOptionSelected
                  ]}
                  onPress={(): void => setNewMenuItem({...newMenuItem, course})}
                >
                  <Text style={[
                    styles.courseOptionText,
                    newMenuItem.course === course && styles.courseOptionTextSelected
                  ]}>
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={addMenuItem}
          >
            <Text style={styles.saveButtonText}>Add to Menu</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Current Menu Items */}
        <Animated.View 
          style={[
            styles.currentMenuContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.sectionTitle}>
            Current Menu Items ({menuItems.length})
          </Text>
          
          {menuItems.length === 0 ? (
            <View style={styles.emptyManageState}>
              <Text style={styles.emptyManageText}>No menu items yet. Add your first item above!</Text>
            </View>
          ) : (
            <FlatList
              data={menuItems}
              renderItem={renderManageMenuItem}
              keyExtractor={(item: MenuItem) => item.id}
              scrollEnabled={false}
              style={styles.manageList}
            />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// Filter Menu Screen Component
const FilterMenuScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const allMenuItems: MenuItem[] = route.params?.menuItems || [];
  const [selectedCourse, setSelectedCourse] = useState<CourseType | 'All'>('All');
  
  const courses: CourseType[] = ['Starters', 'Mains', 'Dessert', 'Drinks'];
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredItems = selectedCourse === 'All' 
    ? allMenuItems 
    : allMenuItems.filter(item => item.course === selectedCourse);

  const renderFilteredMenuItem = ({ item }: { item: MenuItem }) => (
    <Animated.View 
      style={[
        styles.menuCard,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.menuHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.courseContainer}>
        <Text style={styles.itemCourse}>{item.course}</Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter by Course</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Course Filter */}
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <Text style={styles.filterTitle}>Select Course to Filter:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedCourse === 'All' && styles.filterOptionSelected
            ]}
            onPress={(): void => setSelectedCourse('All')}
          >
            <Text style={[
              styles.filterOptionText,
              selectedCourse === 'All' && styles.filterOptionTextSelected
            ]}>
              All Items
            </Text>
          </TouchableOpacity>
          {courses.map((course: CourseType) => (
            <TouchableOpacity
              key={course}
              style={[
                styles.filterOption,
                selectedCourse === course && styles.filterOptionSelected
              ]}
              onPress={(): void => setSelectedCourse(course)}
            >
              <Text style={[
                styles.filterOptionText,
                selectedCourse === course && styles.filterOptionTextSelected
              ]}>
                {course}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.filterResults}>
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          {selectedCourse !== 'All' && ` in ${selectedCourse}`}
        </Text>
      </Animated.View>

      {/* Filtered Results */}
      {filteredItems.length === 0 ? (
        <Animated.View 
          style={[
            styles.emptyState,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.emptyStateTitle}>
            {selectedCourse === 'All' ? 'No Menu Items' : `No ${selectedCourse} Items`}
          </Text>
          <Text style={styles.emptyStateText}>
            {selectedCourse === 'All' 
              ? 'Add some menu items to get started!' 
              : `No items found in ${selectedCourse}. Try another course or add new items.`
            }
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderFilteredMenuItem}
          keyExtractor={(item: MenuItem) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// Main App Component
export default function App(): JSX.Element {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen 
              {...props} 
              menuItems={menuItems}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ManageMenu">
          {(props) => (
            <ManageMenuScreen 
              {...props} 
              menuItems={menuItems}
              setMenuItems={setMenuItems}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="FilterMenu">
          {(props) => (
            <FilterMenuScreen 
              {...props} 
              menuItems={menuItems}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ... Keep all your existing styles exactly as they are ...
const styles = StyleSheet.create({
  // ... All your existing styles remain unchanged ...
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 4,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  statsContainer: {
    backgroundColor: '#34495e',
    padding: 20,
  },
  totalItemsText: {
    color: '#ecf0f1',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  averagePriceContainer: {
    marginTop: 10,
  },
  averagePriceTitle: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  averagePriceScroll: {
    paddingHorizontal: 5,
  },
  averagePriceItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    minWidth: 100,
  },
  averagePriceCourse: {
    color: '#ecf0f1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  averagePriceValue: {
    color: '#e74c3c',
    fontSize: 20,
    fontWeight: 'bold',
  },
  averagePriceCount: {
    color: '#bdc3c7',
    fontSize: 12,
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  manageButton: {
    backgroundColor: '#27ae60',
  },
  filterButton: {
    backgroundColor: '#3498db',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 30,
  },
  menuCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  courseContainer: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  itemCourse: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyStateButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Manage Menu Styles
  manageContainer: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  courseSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  courseOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  courseOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  courseOptionText: {
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: 14,
  },
  courseOptionTextSelected: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentMenuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  manageList: {
    maxHeight: 400,
  },
  manageMenuCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  manageMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  manageMenuInfo: {
    flex: 1,
    marginRight: 10,
  },
  manageItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  manageItemCourse: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 6,
  },
  manageItemDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 18,
  },
  manageMenuActions: {
    alignItems: 'flex-end',
  },
  manageItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyManageState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyManageText: {
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: 16,
  },
  // Filter Styles
  filterContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterScroll: {
    marginBottom: 15,
  },
  filterOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterOptionSelected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  filterOptionText: {
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: 'white',
  },
  filterResults: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },
});