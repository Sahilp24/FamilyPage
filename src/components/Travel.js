import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
  Button,
  Typography,
  Container,
  Card, CardHeader, CardContent,
  Checkbox, TextField, Radio, RadioGroup,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControlLabel, FormControl, FormLabel,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faCancel,
  faEdit,
  faPlane,
  faPlusCircle,
  faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { database } from '../firebase';
import { collection, addDoc, onSnapshot, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore';
import {Link } from "react-router-dom";


const Travel = () => {
    const travelCollection = collection(database, 'travelCountries');
    const [travels, setTravels] = useState([]);
    const [currTravel, setCurrTravel] = useState({
      tripname: '',
      countries: '',
      itinerary: '',
      days: '',
      difficulty: 'easy', // Change to a relevant term for difficulty
      isComplete: false,
    });

  const [errors, setErrors] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [addUpdateFlag, setAddUpdateFlag] = useState(true);

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  const handleModalOpenAdd = () => {
    setOpenModal(true);
    setAddUpdateFlag(true);
    setCurrTravel({
      tripname: '',
      countries: '',
      itinerary: '',
      difficulty: 'easy',
      isComplete: false,
    });
  };

  const handleModalOpenUpdate = (travel) => {
    setOpenModal(true);
    setAddUpdateFlag(false);

    const countriesArray = Array.isArray(travel.countries)
    ? travel.countries
    : travel.countries.split(',');
    travel.countries = countriesArray;

    setCurrTravel(travel);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrTravel({
      ...currTravel,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleCompleteToggle = (travelID) => {
    setTravels((prevTravels) =>
      prevTravels.map((travel) =>
        travel.id === travelID ? { ...travel, isComplete: !travel.isComplete } : travel
      )
    );
  };

  const validateTripName = (newErrors) => {
    if (!currTravel.tripname) {
      newErrors.tripname = 'Travel Name is required';
    } 
    return newErrors;
  };

  const validateCountries = (newErrors) => {
    if (!currTravel.countries) {
      newErrors.countries = 'Countries are required';
    }
    return newErrors;
  }

  const validateItinerary = (newErrors) => {
    if (!currTravel.itinerary) {
      newErrors.itinerary = 'Itinerary is required';
    }
    return newErrors;
  }

  const validateDifficulty = (newErrors) => {
    if (!currTravel.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }
    return newErrors;
  }

  const validateFormAdd = () => {
    var newErrors = {};

    newErrors = validateTripName(newErrors);
    newErrors = validateCountries(newErrors);
    newErrors = validateItinerary(newErrors);
    newErrors = validateDifficulty(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function deleteOurDoc (docToDelete){
    await deleteDoc(docToDelete)
  }

  async function updateOurDoc (docToUpdate){
    await updateDoc(docToUpdate, {
      ...currTravel,
    })
  }

  async function addOurDoc (collectionNameToBeAdded, newDataToBeAdded) {
    const newDoc = await addDoc(collectionNameToBeAdded, {
      ...newDataToBeAdded,
    })
      .then(console.log("Saved to Firebase database"));
    return newDoc;
  }

  const addTravel = async () => {
    if (!validateFormAdd()) {
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    currTravel.countries = currTravel.countries.split(',');
    addOurDoc(travelCollection, currTravel);

    setCurrTravel({
      tripname: '',
      countries: '',
      itinerary: '',
      difficulty: 'easy',
      isComplete: false,
    });
    handleModalClose();
    fetchData();
    toast.success('Travel added successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const validateFormUpdate = () => {
    var newErrors = {};

    newErrors = validateTripName(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateTravel = () => {
    if (!validateFormUpdate()) {
      toast.error('Please fill in all the required fields.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    const countriesArray = Array.isArray(currTravel.countries)
    ? currTravel.countries
    : currTravel.countries.split(',');
    
    currTravel.countries = countriesArray;

    const docToUpdate = doc(database, "travelCountries", currTravel.id);
    updateOurDoc(docToUpdate);

    /*
    setTravels((prevTravels) =>
      prevTravels.map((travel) =>
        travel.id === currTravel.id ? { ...travel, ...currTravel } : travel
      )
    );
    */
    setCurrTravel({
      tripname: '',
      countries: '',
      itinerary: '',
      difficulty: 'easy',
      isComplete: false,
    });
    handleModalClose();
    fetchData();

    toast.success('Travel updated successfully!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  function removeTravelByID(id) {
    //setTravels((prevTravels) => prevTravels.filter((obj) => obj.id !== id));
    const docToDelete = doc(database, "travelCountries", id);
    deleteOurDoc(docToDelete);
    fetchData();
    toast.success('Travel successfully deleted!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(travelCollection); // Replace 'yourCollectionName' with your actual collection name
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTravels(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <Container maxWidth="xl" style={{ padding: '1px', marginTop: '1px', minHeight: '100vh' }}>
      <ToastContainer />

      <Card>
        <CardHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" style={{ color: 'white', textAlign: 'left' }}>
              <FontAwesomeIcon icon={faPlane} style={{ marginRight: '8px' }} />
              TRAVELS
            </Typography>
            <div>
                <Link to="/Home">
                <Button variant="text" sx={{ color: 'white'}} style ={{ marginLeft: '25px'}} >Home </Button>
                </Link>
                <Link to="/Recipe">
                <Button variant="text" sx={{ color: 'white'}} style ={{ marginLeft: '5px'}} >Recipe </Button>
                </Link>
              </div>
            </div>
            
          }
          action={
            <div>
              <Button variant="contained" color="secondary" onClick={handleModalOpenAdd} style ={{marginRight: '3px'}}>
                <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
                Add
              </Button>
              </div>
          }
          style={{ backgroundColor: '#2196F3' }}
        />
        <CardContent style={{ alignItems: 'center' }}>
          <TableContainer component={Paper} style={{ height: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Travel Name</TableCell>
                  <TableCell align="center">Countries</TableCell>
                  <TableCell align="center">Itinerary</TableCell>
                  <TableCell align="center">Difficulty</TableCell>
                  <TableCell align="center">Is Complete</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {travels.map((travel) => (
                  <TableRow key={travel.id}>
                    <TableCell align="center">{travel.tripname}</TableCell>
                    <TableCell align="center">
                      <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                        {travel.countries.map((country, index) => (
                          <li key={index}>{country}</li>
                        ))}
                      </ul>             
                    </TableCell>
                    <TableCell align="center">{travel.itinerary}</TableCell>
                    <TableCell align="center">{travel.difficulty}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={travel.isComplete}
                        onChange={() => handleCompleteToggle(travel.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div>
                        {!travel.isComplete && (
                          <Button
                            onClick={() => handleModalOpenUpdate(travel)}
                            color="primary"
                            variant="contained"
                            sx={{ width: '50%' }}
                          >
                            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
                            Update
                          </Button>
                        )}
                      </div>
                      <div>
                        <Button
                          onClick={() => removeTravelByID(travel.id)}
                          variant="contained"
                          sx={{ bgcolor: 'red', width: '50%' }}
                        >
                          <FontAwesomeIcon icon={faXmarkCircle} style={{ marginRight: '8px' }} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTravel();
          }}
        >
          {/* ... (same as before) */}
        </form>
      </Card>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle style={{ backgroundColor: '#2196F3', color: 'white' }}>
          {addUpdateFlag ? (
            <>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add Travel
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Edit Travel
            </>
          )}
        </DialogTitle>
        <DialogContent>
            <TextField
              label="Travel Name"
              name="tripname"
              value={currTravel.tripname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={!!errors.tripname}
              helperText={errors.tripname}
            />
          <TextField
            label="Countries (Enter as comma-separated)"
            name="countries"
            value={currTravel.countries}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.countries}
            helperText={errors.countries}
            multiline
            rows={2}
          />
          <TextField
            label="Itinerary"
            name="itinerary"
            value={currTravel.itinerary}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!errors.itinerary}
            helperText={errors.itinerary}
            multiline
            rows={2}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Difficulty</FormLabel>
            <RadioGroup
              aria-label="difficulty"
              name="difficulty"
              value={currTravel.difficulty}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="med" control={<Radio />} label="Medium" />
              <FormControlLabel value="hard" control={<Radio />} label="Hard" />
            </RadioGroup>
            {errors.difficulty && (
              <Typography variant="caption" color="red">
                {errors.difficulty}
                helperText={errors.difficulty}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          {addUpdateFlag ? (
            <Button onClick={addTravel} color="primary" variant="contained" sx={{ width: '25%' }}>
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
              Add
            </Button>
          ) : (
            <Button onClick={updateTravel} color="primary" variant="contained" sx={{ width: '25%' }}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
              Update
            </Button>
          )}
          <Button onClick={handleModalClose} variant="contained" sx={{ bgcolor: 'red', width: '25%' }}>
            <FontAwesomeIcon icon={faCancel} style={{ marginRight: '8px' }} />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Travel;
                   
