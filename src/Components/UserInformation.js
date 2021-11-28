import React, {useContext, useState, useEffect} from "react";
import axios from "axios";
import 'cirrus-ui';
import Navbar from "./Navbar";
import {useHistory} from "react-router-dom";
import {Pane, Dialog, Button, toaster} from 'evergreen-ui'
import {BASE_URL, config} from "../utils";
import {AuthContext} from "./Auth";
import {db} from "../config";

function UserInformation() {

  let register_data;
  let reservation_data;
  const [loading, setLoading] = useState(false)
  const [CITIZEN_ID, setCitizenID] = useState("")
  const {currentUser} = useContext(AuthContext);
  const [isShown, setIsShown] = React.useState(false)

  const getInfo = (p) => {
    console.log(CITIZEN_ID)
    axios.all([
      axios.get(`${BASE_URL}/registration/${p}`, config),
      axios.get(`${BASE_URL}/reservation/${p}`, config)
    ])
      .then(axios.spread((register, reservation) => {
        const res_register_data = register.data;
        const res_reservation_data = reservation.data;
        const register_feedback = res_register_data.feedback;
        if (register_feedback === "report failed: citizen ID is not registered") {
          toaster.danger("Submit Failed!", {
            id: "forbidden-action",
            description: "Citizen ID is not registered.",
            duration: 5,
            zIndex: 100
          })
        } else {
          register_data = res_register_data
          reservation_data = res_reservation_data
        }
      }))
      .catch(function (error) {
        toaster.danger("Submit Failed!", {
          id: "forbidden-action",
          description: "Please make sure you already registered.",
          duration: 5,
          zIndex: 100
        })
        console.log(error)
      })
  };

  useEffect(() => {
    db.collection('users').doc(currentUser.uid).get().then(doc => {
      setCitizenID(doc.data().citizen_id)
      getInfo(doc.data().citizen_id)
      setLoading(true)
    })
  }, [])


  // if (reservation_data.length > 0) {
  //   reservation_data = reservation_data[0];
  // } else
  //   reservation_data = {
  //     citizen_id: "",
  //     site_name: "",
  //     vaccine_name: "",
  //     timestamp: "",
  //     queue: "",
  //     checked: ""
  //   }
  // console.log(register_data.citizen_id);

  const history = useHistory();

  const onCancel = async () => {
    // change this to send json
    await axios.delete(`${BASE_URL}/reservation/${reservation_data.citizen_id}`, config)
      .then(function (response) {
        toaster.success("Cancellation Successful!", {
          id: "forbidden-action",
          description: "Latest reservation has been canceled.",
          duration: 5,
          zIndex: 100
        })
        console.log(JSON.stringify(response.data));
        history.push("/info")
      })
      .catch(function (error) {
        toaster.danger("Cancellation Failed!", {
          id: "forbidden-action",
          description: "There is no vaccine reservation to cancel.",
          duration: 5,
          zIndex: 100
        })
        console.log(error);
      });
  }


  return (
    <div className="bg-indigo-200">
      <Navbar/>
      {loading ? (
        <>
          <div className="px-1 py-10 mx-2">
            <div className='row'>
              <div className='col-12'>
                <div className="card">
                  <div className="card__header">
                    <p className="font-bold px-3">User information:</p>
                  </div>
                  <div className='card__footer level content'>
                  </div>
                  <div className='content'>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Name: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.name} {register_data.surname}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Citizen ID: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.citizen_id}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Birth day: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.birth_date}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Occupation: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.occupation}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Phone Number: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.phone_number}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Risk: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.is_risk}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Address: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span>{register_data.address}</span>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-6'>
                <div className='card'>
                  <div className='card__header'>
                    <p className="font-bold px-3">Vaccine Reservation Information:</p>
                  </div>
                  <div className='content'>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Vaccine: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span id={`reserve_vaccine_value`}>{reservation_data.vaccine_name}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Site name: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span id={`reserve_site_value`}>{reservation_data.site_name}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Queue: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span id={`reserve_queue_value`}>{reservation_data.queue}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Date: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span id={`reserve_date_value`}>{reservation_data.timestamp}</span>*/}
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Time: </span>
                      </div>
                      <div className='col-7'>
                        {/*<span id={`reserve_time_value`}>{reservation_data.timestamp}</span>*/}
                      </div>
                    </div>
                  </div>
                </div>

                <Pane>
                  <Dialog
                    isShown={isShown}
                    title="Cancel Reservation"
                    intent="danger"
                    onCloseComplete={() => setIsShown(false)}
                    confirmLabel="Confirm"
                    onConfirm={onCancel}
                  >
                    Are you sure you want to cancel the reservation?
                  </Dialog>

                  <Button className="btn-danger" onClick={() => setIsShown(true)}>Cancel Reservation</Button>
                </Pane>
                {/* <Cancel citizen_id={reservation_data.citizen_id}/> */}

              </div>
              <div className='col-6'>
                <div className='card'>
                  <div className='card__header'>
                    <p className="font-bold px-3">Vaccine Taken:</p>
                  </div>
                  <div className='card__footer level content'>
                  </div>
                  <div className='content'>
                    <div className='row'>
                      <div className='col-5'>
                        <span>AstraZeneca: </span>
                      </div>
                      <div className='col-7'>
                        <span>1</span>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-5'>
                        <span>Sinopharm: </span>
                      </div>
                      <div className='col-7'>
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*<h2>add tap for this three part</h2>*/}

          </div>
        </>
      ) : (
        <>
          loading
        </>
      )}
    </div>
  );
}

export default UserInformation
