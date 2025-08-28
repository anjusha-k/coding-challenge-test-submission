import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import Form from "@/components/Form/Form";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";
import transformAddress from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states
   */
  const { fields, handleChange } = useFormFields();
  const { postCode, houseNumber, firstName, lastName, selectedAddress } = fields;
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();



  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous search results
    setAddresses([]);
    setError(undefined);
    
    if (!postCode || !houseNumber) {
      setError("Postcode and house number fields mandatory!");
      return;
    }
    
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`);
      const data = await response.json();
      
      if (data.status === 'error') {
        setError(data.errormessage);
        return;
      }
      
      if (data.status === 'ok' && data.details) {
        const transformedAddresses = data.details.map((address: any) => 
          transformAddress({ ...address, houseNumber, lat: address.lat, lon: address.long })
        );
        setAddresses(transformedAddresses);
      }
    } catch (err) {
      setError("Failed to fetch addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          onSubmit={handleAddressSubmit}
          legend="🏠 Find an address"
          submitButtonText="Find"
          loading={loading}
        >
          <div className={styles.formRow}>
            <InputText
              name="postCode"
              onChange={handleChange}
              placeholder="Post Code"
              value={postCode}
            />
          </div>
          <div className={styles.formRow}>
            <InputText
              name="houseNumber"
              onChange={handleChange}
              value={houseNumber}
              placeholder="House number"
            />
          </div>
        </Form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {selectedAddress && (
          <Form
            onSubmit={handlePersonSubmit}
            legend="✏️ Add personal info to address"
            submitButtonText="Add to addressbook"
          >
            <div className={styles.formRow}>
              <InputText
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                value={firstName}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                value={lastName}
              />
            </div>
          </Form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
