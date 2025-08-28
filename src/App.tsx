import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";
import transformAddress from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states
   */
  const { fields, handleChange, clearFields } = useFormFields();
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

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

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


    setError(undefined);
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
          onFormSubmit={handleAddressSubmit}
          label="🏠 Find an address"
          submitText="Find"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: postCode,
                onChange: handleChange
              }
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: houseNumber,
                onChange: handleChange
              }
            }
          ]}
        />
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
            onFormSubmit={handlePersonSubmit}
            label="✏️ Add personal info to address"
            submitText="Add to addressbook"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: firstName,
                  onChange: handleChange
                }
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: lastName,
                  onChange: handleChange
                }
              }
            ]}
          />
        )}

        <ErrorMessage message={error} />

        <Button 
          variant="secondary" 
          onClick={() => {
            clearFields();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
